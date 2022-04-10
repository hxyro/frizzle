import { web3 } from "@project-serum/anchor";
import { useWorkspace } from "@/composables";
import { Msg } from "@/models";

export const sendMsg = async (topic, content) => {
  const { wallet, program } = useWorkspace();
  const msg = web3.Keypair.generate();

  await program.value.rpc.sendFreez(topic, content, {
    accounts: {
      author: wallet.value.publicKey,
      freez: msg.publicKey,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [msg],
  });

  const msgAccount = await program.value.account.freez.fetch(msg.publicKey);
  return new Msg(msg.publicKey, msgAccount);
};
