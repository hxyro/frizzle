<script setup>
import { computed, toRefs } from "vue";
import MsgCard from "@/components/MsgCard";

const emit = defineEmits(["update:msgs", "more"]);
const props = defineProps({
  msgs: Array,
  loading: Boolean,
  hasMore: Boolean,
});

const { msgs, loading, hasMore } = toRefs(props);
const orderedMsgs = computed(() => {
  return msgs.value.slice().sort((a, b) => b.timestamp - a.timestamp);
});

const onDelete = (deletedMsg) => {
  const filteredMsgs = msgs.value.filter(
    (msg) => msg.publicKey.toBase58() !== deletedMsg.publicKey.toBase58()
  );
  emit("update:msgs", filteredMsgs);
};
</script>

<template>
  <div class="divide-y">
    <msg-card
      v-for="msg in orderedMsgs"
      :key="msg.key"
      :msg="msg"
      @delete="onDelete"
    ></msg-card>
    <div v-if="loading" class="p-8 text-gray-500 text-center">Loading...</div>
    <div v-else-if="hasMore" class="p-8 text-center">
      <button
        @click="emit('more')"
        class="px-4 py-2 rounded-full border bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
      >
        Load more
      </button>
    </div>
  </div>
</template>
