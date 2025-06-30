<template>
  <div class="home-wrapper">
    <div class="home">
      <div class="home-parts">
        <h1>Markteam</h1>
        <div class="create-flex">
          <SquareButton @click="handleShowCreatePopup"
            >Create new Markteam</SquareButton
          >
          <SquareButton @click="handleShowJoinPopup"
            >Join Markteam</SquareButton
          >

          <Popup v-model:show="showCreatePopup">
            <div class="popup-inner">
              <h3>Create new Markteam</h3>
              <div class="inputs-flex">
                <input
                  class="create-input-password"
                  v-model="newPass"
                  type="password"
                  placeholder="Password"
                />
                <Button @click="create">Create</Button>
              </div>
              <div class="annotation">
                <div @click="copy" :class="{ copied }">
                  <Highlighted>{{ futureId }}</Highlighted>
                </div>
                <span class="greyed">{{ annotation }}</span>
              </div>
            </div>
          </Popup>
          <Popup v-model:show="showJoinPopup">
            <div class="popup-inner">
              <h3>Join Markteam</h3>
              <div class="inputs-flex">
                <input v-model="joinId" placeholder="ID" />
                <input
                  v-model="joinPass"
                  type="password"
                  placeholder="Password"
                />
                <Button @click="join">Join</Button>
              </div>
            </div>
          </Popup>
        </div>
      </div>
      <div class="home-parts" style="align-items: start">
        <h3>Username</h3>

        <div class="create-flex">
          <input
            style="background-color: #222"
            v-model="username"
            placeholder="Enter your name"
            @input="saveUsername"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/shared/ui/Button/Button.vue";
import SquareButton from "@/shared/ui/Button/SquareButton.vue";
import Highlighted from "@/shared/ui/Highlighted/Highlighted.vue";
import Popup from "@/shared/ui/Popup/Popup.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 6);

const router = useRouter();
const newPass = ref("");
const joinId = ref("");
const joinPass = ref("");
const username = ref("");

const showCreatePopup = ref(false);
const futureId = ref("");
const copied = ref(false);
const annotation = ref("Please, save this ID");

const showJoinPopup = ref(false);

async function create() {
  const r = await fetch("/api/docs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPass.value, id: futureId.value }),
  });
  const { id } = await r.json();
  sessionStorage.setItem(`pass:${id}`, newPass.value);
  router.push(`/doc/${id}`);
}

async function join() {
  const r = await fetch(`/api/docs/${joinId.value}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: joinPass.value }),
  });
  if (r.status === 403) return alert("Wrong id/password");
  sessionStorage.setItem(`pass:${joinId.value}`, joinPass.value);
  router.push(`/doc/${joinId.value}`);
}

function handleShowCreatePopup() {
  futureId.value = nanoid();
  showCreatePopup.value = true;
  copied.value = false;
}

function handleShowJoinPopup() {
  showJoinPopup.value = true;
}

function copy() {
  navigator.clipboard.writeText(futureId.value);
  copied.value = true;
  annotation.value = "Copied!";
}

function saveUsername() {
  sessionStorage.setItem("username", username.value);
}
</script>

<style>
.home-wrapper {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home {
  display: flex;
  gap: 30px;
  height: fit-content;
  width: 500px;
  padding: 40px 30px;
  border-radius: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.create-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
}

.create-flex > * {
  flex: 1 1 calc(50% - 5px);
  min-width: 0;
}

.home-parts {
  display: flex;
  gap: 15px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.inputs-flex {
  display: flex;
  gap: 8px;
  width: 100%;
}

.inputs-flex input {
  flex: 1;
  min-width: 0;
}

.popup-inner {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.annotation {
  padding-top: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.copied {
  opacity: 0.5;
}
</style>
