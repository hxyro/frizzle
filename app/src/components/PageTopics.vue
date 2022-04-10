<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { paginateMsgs, topicFilter } from "@/api";
import { useSlug, useFromRoute } from "@/composables";
import MsgForm from "@/components/MsgForm";
import MsgList from "@/components/MsgList";
import MsgSearch from "@/components/MsgSearch";

// Data.
const router = useRouter();
const msgs = ref([]);
const topic = ref("");
const slugTopic = useSlug(topic);
const viewedTopic = ref("");
const filters = ref([]);

const onNewPage = (newMsgs) => msgs.value.push(...newMsgs);
const { prefetch, hasNextPage, getNextPage, loading } = paginateMsgs(
  filters,
  10,
  onNewPage
);

// Actions.
const search = () => {
  router.push(`/topics/${slugTopic.value}`);
};

const fetchTopicMsgs = () => {
  if (slugTopic.value === viewedTopic.value) return;
  msgs.value = [];
  viewedTopic.value = slugTopic.value;
  filters.value = [topicFilter(slugTopic.value)];
  prefetch().then(getNextPage);
};

const addMsg = (msg) => msgs.value.push(msg);

// Router hooks.
useFromRoute((route) => {
  topic.value = route.params.topic;
  if (topic.value) {
    fetchTopicMsgs();
  } else {
    msgs.value = [];
    viewedTopic.value = "";
  }
});
</script>

<template>
  <msg-search
    placeholder="topic"
    :disabled="!slugTopic"
    :modelValue="slugTopic"
    @update:modelValue="(value) => (topic = value)"
    @search="search"
  >
    <template #icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z"
          clip-rule="evenodd"
        />
      </svg>
    </template>
  </msg-search>
  <div v-if="viewedTopic">
    <msg-form @added="addMsg" :forced-topic="viewedTopic"></msg-form>
    <msg-list
      v-model:msgs="msgs"
      :loading="loading"
      :has-more="hasNextPage"
      @more="getNextPage"
    ></msg-list>
    <div
      v-if="!loading && msgs.length === 0"
      class="p-8 text-gray-500 text-center"
    >
      No msgs were found in this topic...
    </div>
  </div>
</template>
