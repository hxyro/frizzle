<script setup>
import { ref, toRefs, computed } from "vue";
import { useWorkspace } from "@/composables";
import { deleteMsg } from "@/api";
import MsgFormUpdate from "./MsgFormUpdate";

const emit = defineEmits(["delete"]);
const props = defineProps({
  msg: Object,
});

const { msg } = toRefs(props);
const { wallet } = useWorkspace();
const isMyMsg = computed(
  () =>
    wallet.value &&
    wallet.value.publicKey.toBase58() === msg.value.author.toBase58()
);
const authorRoute = computed(() => {
  if (isMyMsg.value) {
    return { name: "Profile" };
  } else {
    return { name: "Users", params: { author: msg.value.author.toBase58() } };
  }
});

const isEditing = ref(false);

const onDelete = async () => {
  await deleteMsg(msg.value);
  emit("delete", msg.value);
};
</script>

<template>
  <msg-form-update
    v-if="isEditing"
    :msg="msg"
    @close="isEditing = false"
  ></msg-form-update>
  <div class="px-8 py-4" v-else>
    <div class="flex justify-between">
      <div class="py-1">
        <h3 class="inline font-semibold" :title="msg.author">
          <router-link :to="authorRoute" class="hover:underline">
            {{ msg.author_display }}
          </router-link>
        </h3>
        <span class="text-gray-500"> • </span>
        <time class="text-gray-500 text-sm" :title="msg.created_at">
          <router-link
            :to="{
              name: 'Msg',
              params: { msg: msg.publicKey.toBase58() },
            }"
            class="hover:underline"
          >
            {{ msg.created_ago }}
          </router-link>
        </time>
      </div>
      <div class="flex" v-if="isMyMsg">
        <button
          @click="isEditing = true"
          class="flex px-2 rounded-full text-gray-500 hover:text-green-500 hover:bg-gray-100"
          title="Update msg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 m-auto"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
            />
            <path
              fill-rule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button
          @click="onDelete"
          class="flex px-2 rounded-full text-gray-500 hover:text-green-500 hover:bg-gray-100"
          title="Delete msg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 m-auto"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
    <p class="whitespace-pre-wrap break-all" v-text="msg.content"></p>
    <router-link
      v-if="msg.topic"
      :to="{ name: 'Topics', params: { topic: msg.topic } }"
      class="inline-block mt-2 text-green-500 hover:underline break-all"
    >
      #{{ msg.topic }}
    </router-link>
  </div>
</template>
