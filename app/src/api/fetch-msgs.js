import { useWorkspace, usePagination } from "@/composables";
import { Msg } from "@/models";
import bs58 from "bs58";
import { BN } from "@project-serum/anchor";
import { computed, ref } from "vue";

export const fetchMsgs = async (filters = []) => {
  const { program } = useWorkspace();
  const msgs = await program.value.account.freez.all(filters);
  return msgs.map((msg) => new Msg(msg.publicKey, msg.account));
};

export const paginateMsgs = (
  filters = [],
  perPage = 6,
  onNewPage = () => {}
) => {
  filters = ref(filters);
  const { program, connection } = useWorkspace();
  const page = ref(0);

  const prefetchCb = async () => {
    // Reset page number.
    page.value = 0;

    // Prepare the discriminator filter.
    const msgClient = program.value.account.freez;
    const msgAccountName = msgClient._idlAccount.name;
    const msgDiscriminatorFilter = {
      memcmp: msgClient.coder.accounts.memcmp(msgAccountName),
    };

    // Prefetch all msgs with their timestamps only.
    const allMsgs = await connection.getProgramAccounts(
      program.value.programId,
      {
        filters: [msgDiscriminatorFilter, ...filters.value],
        dataSlice: { offset: 40, length: 8 },
      }
    );

    // Parse the timestamp from the account's data.
    const allMsgsWithTimestamps = allMsgs.map(({ account, pubkey }) => ({
      pubkey,
      timestamp: new BN(account.data, "le"),
    }));

    return allMsgsWithTimestamps
      .sort((a, b) => b.timestamp.cmp(a.timestamp))
      .map(({ pubkey }) => pubkey);
  };

  const pageCb = async (page, paginatedPublicKeys) => {
    const msgs = await program.value.account.freez.fetchMultiple(
      paginatedPublicKeys
    );

    return msgs.reduce((accumulator, msg, index) => {
      const publicKey = paginatedPublicKeys[index];
      accumulator.push(new Msg(publicKey, msg));
      return accumulator;
    }, []);
  };

  const pagination = usePagination(perPage, prefetchCb, pageCb);
  const { hasPage, getPage } = pagination;

  const hasNextPage = computed(() => hasPage(page.value + 1));
  const getNextPage = async () => {
    const newPageMsgs = await getPage(page.value + 1);
    page.value += 1;
    onNewPage(newPageMsgs);
  };

  return { page, hasNextPage, getNextPage, ...pagination };
};

export const authorFilter = (authorBase58PublicKey) => ({
  memcmp: {
    offset: 8, // Discriminator.
    bytes: authorBase58PublicKey,
  },
});

export const topicFilter = (topic) => ({
  memcmp: {
    offset:
      8 + // Discriminator.
      32 + // Author public key.
      8 + // Timestamp.
      4, // Topic string prefix.
    bytes: bs58.encode(Buffer.from(topic)),
  },
});
