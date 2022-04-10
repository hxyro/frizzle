<script setup>
import { ref, watchEffect } from "vue";
import { PublicKey } from "@solana/web3.js";
import { getMsg } from "@/api";
import { useFromRoute } from "@/composables";
import MsgCard from "@/components/MsgCard";

const msgAddress = ref(null);
useFromRoute((route) => (msgAddress.value = route.params.msg));

const loading = ref(false);
const msg = ref(null);
watchEffect(async () => {
  try {
    loading.value = true;
    msg.value = await getMsg(new PublicKey(msgAddress.value));
  } catch (e) {
    msg.value = null;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading" class="p-8 text-gray-500 text-center">Loading...</div>
  <div v-else-if="!msg" class="p-8 text-gray-500 text-center">
    Msg not found
  </div>
  <msg-card
    v-else
    :msg="msg"
    @delete="$router.push({ name: 'Home' })"
  ></msg-card>
</template>
