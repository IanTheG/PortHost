<template>
  <header>
    <h1>porthost.io</h1>
  </header>

  <main>
    <section class="links">
      <label for="port">
        <a
          :href="`http://localhost:${state.port}`"
          ref="port"
          rel="noreferrer"
          target="_blank"
          @click="openHost('port')"
        >
          http://localhost:
        </a>
      </label>
      <input id="port" placeholder="port#" type="text" v-model="state.port" @keydown="detectKey($event, 'port')" />
      <label for="address">
        <a
          :href="`http://192.168.${state.address}`"
          ref="address"
          rel="noreferrer"
          target="_blank"
          @click="openHost('address')"
          >http://192.168.
        </a>
      </label>
      <input
        id="address"
        placeholder="#.#:port#"
        type="text"
        v-model="state.address"
        @keydown="detectKey($event, 'address')"
      />
    </section>

    <section class="text" v-if="state.saved.length === 0 && state.recent.length === 0">
      <h2>Speed up development with easy access to your favorite dev servers on localhost ports and IPv4 addresses.</h2>
      <br />
      <p>Type in a port number or IPV4 address, hit Enter or click the link</p>
      <p>Localhost ports range from 0 to 65,535 (or 2^16 – 1)</p>
      <p>Data persists using your browser's Local Storage</p>
      <p>You may have to allow popups for this site</p>
    </section>

    <h2 v-if="state.saved.length === 0">You have no saved ports or addresses</h2>
    <h2 v-else>Saved</h2>
    <section class="list">
      <div v-for="item in state.saved.slice().sort((a, b) => a - b)" class="list-item-box">
        <div class="list-item">
          <a :href="determineHref(item)" ref="link_savedPorts" rel="noreferrer" target="_blank">
            {{ item }}
          </a>
          <div class="btn-box">
            <button class="deletePortFromSaved" @click="deletePort(item)">×</button>
          </div>
        </div>
      </div>
    </section>

    <h2 v-if="state.recent.length === 0">You have no recent ports or addresses</h2>
    <h2 v-else>Recent</h2>
    <section class="list">
      <div v-for="item in state.recent.slice().sort((a, b) => a - b)" class="list-item-box">
        <div class="list-item">
          <a :href="determineHref(item)" ref="link_recentPorts" rel="noreferrer" target="_blank">
            {{ item }}
          </a>
          <div class="btn-box">
            <button class="savePort" @click="savePort(item)">♥︎</button>
            <button class="deletePort" @click="deletePort(item)">×</button>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <p>
      Copyright &copy; 2021
      <a href="https://www.linkedin.com/in/ian-goodwin-6489341b8/" rel="noreferrer" target="_blank"> Ian Goodwin </a>
    </p>
    <p>Built using Vue 3</p>
  </footer>
</template>

<script>
import { reactive, watch, onUpdated } from 'vue'

export default {
  setup() {
    /** Defines state
     * @param {string} port - The default port
     * @param {string} address - The default address
     * @param {string[]} recent - A list of recent ports and addresses pulled from localStorage
     * @param {string[]} saved - A list of saved ports and addresses pulled from localStorage
     */
    const state = reactive({
      port: '',
      address: '',
      recent: [],
      saved: [],
    })
    const portsInStorage = localStorage.getItem('porthost-data')
    if (portsInStorage) {
      const portsObject = JSON.parse(portsInStorage)
      state.recent = portsObject.recent || []
      state.saved = portsObject.saved || []
    }

    /** Watches state.port and state.address changes
     * @function watch - Formats port (0 to 65535) or address (000.000 to 255.255) in input element
     */
    watch(
      () => state.port,
      (port, prevPort) => {
        if (!port.match(/^\d+$/)) {
          state.port = prevPort
        }
        if (port.length === 0) {
          state.port = ''
        }
        if (Number(port) > 65535) {
          state.port = '65535'
        }
      }
    )
    watch(
      () => state.address,
      (address, prevAddress) => {
        if (address.match(/^\d{1,}$/)) {
          if (Number(address) > 255) state.address = prevAddress
          if (Number(address) === 0) state.address = '0'
        } else if (address.match(/^\d{1,3}\.\d{0,3}$/)) {
          const secondNum = address.split('.')
          if (Number(secondNum[1]) > 255) state.address = prevAddress
        } else if (address.match(/^\d{1,3}\.\d{1,3}:\d{0,5}$/)) {
          const thirdNum = address.split(':')
          if (Number(thirdNum[1]) > 65535) state.address = prevAddress
        } else {
          state.address = prevAddress
        }
        if (address.length === 0) {
          state.address = ''
        }
      }
    )

    onUpdated(() => {
      localStorage.setItem('porthost-data', JSON.stringify(state))
    })

    return {
      state,
    }
  },
  methods: {
    /** Opens port
     * @function openPort
     * @param {string} type Either 'port' or 'address'
     *
     * Remove port from recent ports list if exists,
     * Append port to end of list if not in saved ports list,
     * Remove port at start of list if list.length >= 16,
     * "Click" <a> tag to open in new tab.
     */
    openHost(type) {
      if (this.state[type].length !== 0) {
        if (this.state.recent.includes(this.state[type])) {
          this.state.recent = [...this.state.recent.filter((item) => item !== this.state[type])]
        }
        if (!this.state.saved.includes(this.state[type])) {
          this.state.recent.push(this.state[type])
        }
        if (this.state.recent.length >= 16) {
          this.state.recent.shift()
        }
        this.state[type] = ''
      }
    },
    // On enter key press, call openPort
    detectKey({ key }, type) {
      if (key === 'Enter' && this.state[type].length !== 0) {
        this.openHost(type)
        this.$refs[type].click()
      }
    },
    /** Determines href for a tag based on item in storage
     * @function determineHref
     * @param {string} item The port or address from state.saved
     * @returns {string} The resulting href attribute
     */
    determineHref(item) {
      if (item.includes('.')) {
        return `http://192.168.${item}`
      } else {
        return `http://localhost:${item}`
      }
    },
    /** Saves port
     * @function savePort
     * @param {string} selectedItem - The port or address the user just clicked
     * Adds port or address to saved and removes it from recent in state
     */
    savePort(selectedItem) {
      if (!this.state.saved.includes(selectedItem)) {
        this.state.saved.push(selectedItem)
        this.state.recent = this.state.recent.filter((item) => item !== selectedItem)
      }
    },
    /** Deletes port
     * @function deletePort
     * @param {string} selectedItem - The port or address the user just clicked
     * Deletes port or address from recent and saved in state
     */
    deletePort(selectedItem) {
      this.state.recent = this.state.recent.filter((item) => item !== selectedItem)
      this.state.saved = this.state.saved.filter((item) => item !== selectedItem)
    },
  },
}

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md
</script>

<style lang="scss">
$almostBlack: #2c3e50;

html {
  height: 100%;
}
body {
  height: 100%;
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
  height: 100%;
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

  &:before,
  &:after {
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

  .links {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr auto;

    label {
      position: relative;
      top: 0.25rem;
      font-size: 2rem;
    }
    input {
      max-width: 15rem;
      font-size: 2rem;
    }
  }

  .text {
    max-width: 80vw;
    margin: 1rem 0;
    > * {
      margin: 0;
    }
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
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.06);
    --show-btn-box: 1;
  }

  > .list-item {
    display: flex;
    flex-direction: column;

    left: 4px;
    top: -4px;
    position: relative;

    background-color: whitesmoke;
    border: 2px solid $almostBlack;
    border-radius: 10px;
    box-sizing: border-box;

    min-width: 8rem;
    height: 8rem;

    a {
      flex: 1;
      font-size: 2rem;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-box {
      transition: all 0.2s ease-in-out;
      opacity: var(--show-btn-box);
      position: relative;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      height: 32%;

      > button {
        font-size: 2rem;
        width: 100%;
        border: none;
        background: transparent;
        cursor: pointer;
        padding: 0;
        margin: 0;
      }

      .savePort {
        border-bottom-left-radius: 8px;
        &:hover {
          color: white;
          background-color: goldenrod;
        }
      }
      .deletePort {
        border-bottom-right-radius: 8px;
        &:hover {
          color: white;
          background-color: red;
        }
      }
      .deletePortFromSaved {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        &:hover {
          color: white;
          background-color: red;
        }
      }
    }
  }
}

footer {
  padding-top: 60px;
}
</style>
