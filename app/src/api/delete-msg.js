import { useWorkspace } from "@/composables";

export const deleteMsg = async (msg) => {
  const { wallet, program } = useWorkspace();
  await program.value.rpc.deleteFreez({
    accounts: {
      author: wallet.value.publicKey,
      freez: msg.publicKey,
    },
  });
};
