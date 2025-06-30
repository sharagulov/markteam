<template>
  <div class="home-wrapper">
    <div class="home">
      <div class="home-parts">
        <h1>Markteam</h1>
        <div class="main-blocks">
          <input
            style="background-color: #222"
            v-model="username"
            placeholder="Enter your name"
            @input="saveUsername"
          />
          <div class="create-flex">
            <SquareButton :iconPath="mdiNew" @click="handleShowCreatePopup"
              >Create new markdown</SquareButton
            >
            <SquareButton :iconPath="mdiJoin" @click="handleShowJoinPopup"
              >Join markdown</SquareButton
            >

            <Popup v-model:show="showCreatePopup">
              <div class="popup-inner">
                <h3>Create new markdown</h3>
                <div class="inputs-flex">
                  <input
                    class="create-input-password"
                    v-model="newPass"
                    type="password"
                    placeholder="Password"
                  />
                  <Button class="home-button" @click="create">Create</Button>
                </div>
              </div>
              <template #list>
                <div class="annotation">
                  <div @click="copy" :class="{ copied }">
                    <Highlighted>{{ futureId }}</Highlighted>
                  </div>
                  <span class="greyed">{{ annotation }}</span>
                </div>
              </template>
            </Popup>
            <Popup v-model:show="showJoinPopup">
              <div class="popup-inner">
                <h3>Join markdown</h3>
                <div class="inputs-flex">
                  <input v-model="joinId" placeholder="ID" />
                  <input
                    v-model="joinPass"
                    type="password"
                    placeholder="Password"
                  />
                  <Button class="home-button" @click="join">Join</Button>
                </div>
              </div>
            </Popup>
          </div>
        </div>
      </div>
      <div class="last-documents" v-if="lastDocuments.length">
        <span>Last visited documents</span>
        <div class="tiles">
          <DocumentTile
            v-for="doc in lastDocuments"
            :key="doc.id"
            :onClick="() => openDoc(doc.id)"
          >
            {{ doc.id }}
            <template #time>
              {{ doc.time }}
            </template>
          </DocumentTile>
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
import DocumentTile from "@/shared/ui/Button/DocumentTile.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

import { mdiNew, mdiJoin } from "/assets/icons.ts";

import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 6);

const lastDocuments = ref<{ id: string; hash: string; time: string }[]>([]);

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

const lastUserName = sessionStorage.getItem("username");

onMounted(() => {
  username.value = lastUserName || "";

  try {
    const raw = sessionStorage.getItem("lastDocuments");
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      lastDocuments.value = parsed;
    }
  } catch {
    lastDocuments.value = [];
  }
});

async function create() {
  const r = await fetch("/api/docs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPass.value, id: futureId.value }),
  });
  const { id, hash, time } = await r.json();
  updateLastDocuments(id, hash, time);
  router.push(`/doc/${id}`);
}

async function join() {
  const r = await fetch(`/api/docs/${joinId.value}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: joinPass.value }),
  });
  if (r.status === 403) return alert("Wrong id/password");
  const { hash, time } = await r.json();
  updateLastDocuments(joinId.value, hash, time);
  router.push(`/doc/${joinId.value}`);
}

function updateLastDocuments(id: string, hash: string, time: string) {
  const raw = sessionStorage.getItem("lastDocuments");
  let docs: { id: string; hash: string; time: string }[] = [];

  try {
    if (raw) {
      docs = JSON.parse(raw);
      if (!Array.isArray(docs)) docs = [];
    }
  } catch {
    docs = [];
  }

  docs = docs.filter((doc) => doc.id !== id);

  docs.unshift({ id, hash, time });

  if (docs.length > 3) {
    docs = docs.slice(0, 3);
  }

  sessionStorage.setItem("lastDocuments", JSON.stringify(docs));
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

function openDoc(id: string) {
  router.push(`/doc/${id}`);
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

.main-blocks {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.inputs-flex {
  display: flex;
  gap: 8px;
  width: 100%;
}

.inputs-flex input {
  min-width: 0;
}

.popup-inner {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.annotation {
  display: flex;
  gap: 10px;
  margin: 16px;
  align-items: center;
}

.copied {
  opacity: 0.5;
}

.last-documents {
  width: 100%;
}

.tiles {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

@media (max-width: 500px) {
  .create-flex {
    flex-direction: column;
  }

  .inputs-flex {
    flex-direction: column;
    align-items: center;
  }

  .home-button {
    margin-top: 10px;
  }

  .popup-inner {
    align-items: center;
  }
}
</style>
