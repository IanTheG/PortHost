<template>
<header>
  <h1>porthost.dev</h1>
</header>

<main>
  <div class="url">
    <label for="port">
        <a
          :href="`http://localhost:${state.port}`"
          ref="link"
          rel="noreferrer"
          target="blank"
          @click="openPort()"
        >
          http://localhost:
        </a>
    </label>
    <input
      id="port"
      pattern="[0-9]+"
      placeholder="port #"
      type="text"
      v-model="state.port"
      @keydown="detectKey($event)"
      @click="hideHelpText()"
    >
  </div>

  <div class="text" ref="helperText">
    <p>Type in a port number, hit Enter or click the link</p>
    <p>Ports range from 0 to 65,535 (or 2^16 – 1)</p>
    <p>Data persists using your browser's Local Storage</p>
    <p>You may have to allow popups for this site</p>
  </div>

  <h2 v-if="state.savedPorts.length === 0">You have no saved ports</h2>
  <h2 v-else>Saved Ports</h2>
  <section class="list">
    <div v-for="port in state.savedPorts.slice().sort((a, b) => a - b)">
      <div class="list-item-box">
        <div class="list-item">
          <a
            :href="`http://localhost:${port}`"
            ref="link_savedPorts"
            rel="noreferrer"
            target="blank"
          >
            {{ port }}
          </a>
          <div class="btn-box">
            <button @click="savePort(port)" v-if="!state.savedPorts.includes(port)">♥︎</button>
            <button @click="deletePort(port)">⨯</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <h2 v-if="state.recentPorts.length === 0">You have no recent ports</h2>
  <h2 v-else>Recent Ports</h2>
  <section class="list">
    <div v-for="port in state.recentPorts.slice().sort((a, b) => a - b)">
      <div class="list-item-box">
        <div class="list-item">
          <a
            :href="`http://localhost:${port}`"
            ref="link_recentPorts"
            rel="noreferrer"
            target="blank"
          >
            {{ port }}
          </a>
          <div class="btn-box">
            <button @click="savePort(port)">♥︎</button>
            <button @click="deletePort(port)">⨯</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<footer>
  <p>Copyright 2021 Ian Goodwin</p>
  <p>Built using Vue 3</p>
</footer>

</template>

<script>
import { reactive, watch, onUpdated } from 'vue'

export default {
  setup() {

    /** Defines state
     * @param {string} port - The default port
     * @param {string[]} ports - A list of ports pulled from localStorage
     */
    const state = reactive({
      port: "",
      recentPorts: [],
      savedPorts: [],
    })
    const portsInStorage = localStorage.getItem('porthostdev-userports')
    if (portsInStorage) {
      const portsObject = JSON.parse(portsInStorage)
      state.recentPorts = portsObject.recentPorts || []
      state.savedPorts = portsObject.savedPorts || []
      state.port = portsObject.savedPorts[portsObject.savedPorts.length - 1] || ""
    }

    /** Watches state.port changes
     * @function watch - Formats port in input element 
     */
    watch(() => state.port, (port, prevPort) => {
      if (!port.match(/^\d+$/)) {
        state.port = prevPort
      }
      if (port.length === 0) {
        state.port = ""
      }
      if (Number(port) > 65535) {
        state.port = "65535"
      }
    })

    onUpdated(() => {
      localStorage.setItem('porthostdev-userports', JSON.stringify(state))
    })

    return {
      state
    }
  },
  methods: {
    /** Fades out helper text when the port input element is clicked
     * @function fadeoutText
     */
    hideHelpText() {
      if (this.$refs.helperText.style.display !== "none") {
        this.$refs.helperText.style.display = "none"
      }
    },
    /** Opens port
     * @function openPort
     * Remove port from recent ports list if exists, 
     * Append port to end of list if not in saved ports list, 
     * Remove port at start of list if list.length >= 16, 
     * "Click" <a> tag to open in new tab.
     */
    openPort() {
      if (this.state.port.length !== 0) {
        if (this.state.recentPorts.includes(this.state.port)) {
          this.state.recentPorts = [...this.state.recentPorts.filter((port) => port !== this.state.port)]
        }
        if (!this.state.savedPorts.includes(this.state.port)) {
          this.state.recentPorts.push(this.state.port)
        }
        if (this.state.recentPorts.length >= 16) {
          this.state.recentPorts.shift()
        }
      }
    },
    // On enter key press, call openPort
    detectKey({ key }) {
      if (key === 'Enter' && this.state.port.length !== 0) {
        this.openPort()
        this.$refs.link.click()
      }
    },
    /** Saves port
     * @function savePort
     * @param {string} selectedPort - The port the user just clicked
     * Adds port to savedPorts and removes port from recentPorts in state
     */
    savePort(selectedPort) {
      if (!this.state.savedPorts.includes(selectedPort)) {
        this.state.savedPorts.push(selectedPort)
        this.state.recentPorts = this.state.recentPorts.filter((port) => port !== selectedPort)
      }
    },
    /** Deletes port
     * @function deletePort
     * @param {string} selectedPort - The port the user just clicked
     * Deletes port from recentPorts and savedPorts in state
     */
    deletePort(selectedPort) {
      this.state.recentPorts = this.state.recentPorts.filter((port) => port !== selectedPort)
      this.state.savedPorts = this.state.savedPorts.filter((port) => port !== selectedPort)
    }
  }
}

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md
</script>

<style lang="scss">
$almostBlack: #2c3e50;

body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $almostBlack;
  padding-top: 60px;

  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
}
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  h1 {
    margin: 1rem;
  }

  &:before, &:after {
    content: '';
    background-color: $almostBlack;
    height: 0.1rem;
    width: 8rem;
  }
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;

  .text {
    margin: 1rem 0;
    > * {
      margin: 0;
    }
  }
}

.url {
  display: flex;
  flex-direction: row;

  label {
    font-size: 2rem;
  }
  input {
    max-width: 8rem;
    font-size: 2rem;
  }
}

.list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  max-width: 80vw;
}

.list-item-box {

  --show-btn-box: 0;

  background: $almostBlack;
  border-radius: 10px;
  width: calc(100% - 4px);
  transition: all .2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    --show-btn-box: 1;
  }

  > .list-item {
    left: 4px;
    top: -4px;
    position: relative;

    background-color: whitesmoke;
    border: 2px solid $almostBlack;
    border-radius: 10px;
    width: 10rem;
    height: 8rem;
    display: flex;
    align-items: stretch;
    flex-direction: column;

    a {
      flex: 1;
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-box {
      transition: all .2s ease-in-out;
      opacity: var(--show-btn-box);
      position: relative;
      display: flex;
      justify-content: space-between;

      > button {
        font-size: 2rem;
        width: 200%;
        border: none;
        background: transparent;
        cursor: pointer;

        &:hover {
          color: red;
        }
      }
    }
  }
}

input:invalid {
  border: 3px solid red;
}

footer {
  padding-top: 60px;
}
</style>
