<script setup>
import TheSidebar from "./components/TheSidebar";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { initWallet } from "solana-wallets-vue";
import { initWorkspace } from "@/composables";

const wallets = [new PhantomWalletAdapter()];

initWallet({ wallets, autoConnect: true });
initWorkspace();
</script>

<template>
  <div class="w-full max-w-3xl lg:max-w-4xl mx-auto bg-black bg-opacity-50">
    <div class="back blur-md"></div>
    <the-sidebar class="py-4"></the-sidebar>
    <main class="flex-1">
      <router-view></router-view>
    </main>
  </div>
</template>
