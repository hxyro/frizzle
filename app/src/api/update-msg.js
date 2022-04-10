import { useWorkspace } from "@/composables";

export const updateMsg = async (msg, topic, content) => {
  const { wallet, program } = useWorkspace();
  await program.value.rpc.updateFreez(topic, content, {
    accounts: {
      author: wallet.value.publicKey,
      freez: msg.publicKey,
    },
  });

  msg.topic = topic;
  msg.content = content;
};
