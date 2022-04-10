import { useWorkspace } from "@/composables";
import { Msg } from "@/models";

export const getMsg = async (publicKey) => {
  const { program } = useWorkspace();
  const account = await program.value.account.freez.fetch(publicKey);
  return new Msg(publicKey, account);
};
