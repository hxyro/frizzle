<script setup>
import { ref } from "vue";
import { paginateMsgs } from "@/api";
import MsgForm from "@/components/MsgForm";
import MsgList from "@/components/MsgList";

const msgs = ref([]);
const onNewPage = (newMsgs) => msgs.value.push(...newMsgs);
const { prefetch, hasNextPage, getNextPage, loading } = paginateMsgs(
  [],
  10,
  onNewPage
);
prefetch().then(getNextPage);

const addMsg = (msg) => msgs.value.push(msg);
</script>

<template>
  <msg-form @added="addMsg"></msg-form>
  <msg-list
    v-model:msgs="msgs"
    :loading="loading"
    :has-more="hasNextPage"
    @more="getNextPage"
  ></msg-list>
</template>
