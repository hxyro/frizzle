<script setup>
import { ref, watchEffect } from "vue";
import { paginateMsgs, authorFilter } from "@/api";
import MsgForm from "@/components/MsgForm";
import MsgList from "@/components/MsgList";
import { useWorkspace } from "@/composables";

const msgs = ref([]);
const { wallet } = useWorkspace();
const filters = ref([]);

const onNewPage = (newMsgs) => msgs.value.push(...newMsgs);
const { prefetch, hasNextPage, getNextPage, loading } = paginateMsgs(
  filters,
  10,
  onNewPage
);

watchEffect(() => {
  if (!wallet.value) return;
  msgs.value = [];
  filters.value = [authorFilter(wallet.value.publicKey.toBase58())];
  prefetch().then(getNextPage);
});

const addMsg = (msg) => msgs.value.push(msg);
</script>

<template>
  <div v-if="wallet" class="border-b px-8 py-4 bg-gray-800 break-all">
    {{ wallet.publicKey.toBase58() }}
  </div>
  <msg-form @added="addMsg"></msg-form>
  <msg-list
    v-model:msgs="msgs"
    :loading="loading"
    :has-more="hasNextPage"
    @more="getNextPage"
  ></msg-list>
</template>
