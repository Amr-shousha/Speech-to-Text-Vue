<script setup>
import { ref, onMounted, computed } from "vue";
import { jsPDF } from "jspdf";

const transcript = ref("");
const lastTranscript = ref("");
const isRecording = ref(false);
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const sr = Recognition ? new Recognition() : null;
const isClicked = ref(false);

onMounted(() => {
  sr.continuous = true;
  sr.interimResults = true;
  sr.onstart = () => {
    console.log("starting record");
    isRecording.value = true;
  };
  sr.onend = () => {
    console.log("stop record");
    isRecording.value = false;
  };
  sr.onresult = (evt) => {
    console.log(evt.results);
    for (let i = 0; i < evt.results.length; i++) {
      const result = evt.results[i];
      if (result.isFinal) {
        CheckForCommand(result);
      }
    }

    const t = Array.from(evt.results)
      .map((result) => result[0]) // Extracts the first alternative of each result
      .map((result) => result.transcript) // Extracts the transcript text
      .join(""); // Joins all the transcript texts into a single string

    if (t !== transcript.value) {
      transcript.value += t.replace(lastTranscript.value, "");
    }
    lastTranscript.value = t;
  };
});

const CheckForCommand = (result) => {
  const t = result[0].transcript;
  if (t.includes("stop recording")) {
    sr.stop();
  } else if (t.includes("what is the time") || t.includes("what's the time")) {
    sr.stop();
    alert(new Date().toLocaleTimeString());
    setTimeout(() => sr.start(), 50);
  } // else if (t.includes("period")) {
  //   lastTranscript.value += ".";
  // }
};
const toggleButton = () => {
  if (!sr) return;

  try {
    if (isRecording.value) {
      isClicked.value = false;
      sr.stop();
      // console.log("toggel stop");
    } else {
      sr.start();
      isClicked.value = true;
      console.log("Listening...");
    }
  } catch (error) {
    console.error("SpeechRecognition Error:", error);
  }
};

const buttonClass = computed(() => {
  return isClicked.value ? "clicked" : "not-clicked";
});

const downloadPDF = () => {
  const doc = new jsPDF();
  doc.text(lastTranscript.value, 10, 10);
  doc.save("document.pdf");
};
</script>

<template>
  <div class="app d-flex flex-column align-items-center">
    <h1 class="animate__animated animate__fadeInUp">Speech to Text</h1>
    <h2>Take Notes with Your Voice</h2>
    <button
      :class="['commonClass animate__animated animate__flash', buttonClass]"
      @click="toggleButton"
    ></button>
    <!-- <textarea class="transcript">{{ lastTranscript }}</textarea> -->
    <textarea class="transcript" v-model="lastTranscript"></textarea>

    <div
      class="animate__animated animate__flash hover-trigger"
      @click="downloadPDF"
    >
      <img src="/imgs/download icon.png" alt="" />
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.transcript {
  padding: 10px;
  width: 70%;
  height: 150px;
  border: none;
}
.commonClass {
  background: url("/imgs/icons8-microphone-80.png") no-repeat center/cover;
  border: none;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

.clicked {
  background-color: rgb(255, 46, 46);
}
.not-clicked {
  background-color: rgb(0, 102, 197);
}
.app {
  padding: 80px;
  gap: 20px;
}
.hover-trigger:hover {
  cursor: pointer;
}
.hover-trigger img {
  width: 40px;
}
h1 {
  color: #009138;

  font-weight: 700;
}
h2 {
  margin-top: -25px;
  color: rgb(82, 82, 82);
}
</style>
