<template>
  <header>
    <h1>porthost.io</h1>
  </header>
  <!-- 
  <div class="theme-switch-container">
    <div class="theme-switch">
      <button :class="state.theme ? '' : 'active'" @click="toggleTheme(false)">
        <svg
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          preserveAspectRatio="xMidYMid meet"
          width="30px"
          height="30px"
        >
          <path
            fill="currentColor"
            d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"
          ></path>
        </svg>
      </button>
      <button :class="state.theme ? 'active' : ''" @click="toggleTheme(true)">
        <svg
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          preserveAspectRatio="xMidYMid meet"
          width="30px"
          height="30px"
        >
          <path
            fill="currentColor"
            d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"
          ></path>
        </svg>
      </button>
    </div>
  </div> 
-->

  <main>
    <section class="link-switch">
      <div class="link-switch-container" style="justify-content: flex-end">
        <h3 class="link-type" @click="state.linkType = false">Localhost</h3>
      </div>
      <label class="switch" style="margin: 1rem">
        <input type="checkbox" ref="link_type" :checked="state.linkType" @click="state.linkType = !state.linkType" />
        <div>
          <span></span>
        </div>
      </label>
      <div class="link-switch-container" style="justify-content: flex-start">
        <h3 class="link-type" @click="state.linkType = true">IPV4 address</h3>
      </div>
    </section>
    <section class="links">
      <div :style="state.linkType ? 'display: none' : 'display: flex'">
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
      </div>
      <div :style="state.linkType ? 'display: flex' : 'display: none'">
        <label for="address">
          <a
            :href="`http://${state.address}`"
            ref="address"
            rel="noreferrer"
            target="_blank"
            @click="openHost('address')"
            >http://
          </a>
        </label>
        <input
          id="address"
          placeholder="#.#.#.#:port#"
          type="text"
          v-model="state.address"
          @keydown="detectKey($event, 'address')"
        />
      </div>
    </section>

    <section class="text" v-if="state.saved.length === 0 && state.recent.length === 0">
      <h2>Speed up development with easy access to your favorite dev servers on localhost ports and IPv4 addresses.</h2>
      <br />
      <p>Type in a port number or IPv4 address, hit Enter or click the link</p>
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
      Copyright &copy; {{ new Date().getFullYear() }}
      <a href="https://www.linkedin.com/in/ian-goodwin-6489341b8/" rel="noreferrer" target="_blank"> Ian Goodwin </a>
    </p>
    <p>Built using Vue 3</p>
  </footer>
</template>

<script>
import { reactive, watch, onMounted, onUpdated, toRaw } from 'vue'
import LocalForage from 'localforage'

export default {
  setup() {
    /** Defines state
     * @param {string} theme - The theme, either light or dark
     * @param {string} address - Determines the rendered label and input, for either localhost or ipv4 addresses
     * @param {string} port - The default port
     * @param {string} address - The default address
     * @param {string[]} recent - A list of recent ports and addresses pulled from localStorage
     * @param {string[]} saved - A list of saved ports and addresses pulled from localStorage
     */
    const state = reactive({
      theme: false,
      linkType: false, // false: localhost, true: ipv4
      port: '',
      address: '',
      recent: [],
      saved: [],
    })
    // const portsInStorage = localStorage.getItem('porthost-data')
    // if (portsInStorage) {
    //   const portsObject = JSON.parse(portsInStorage)
    //   state.recent = portsObject.recent || []
    //   state.saved = portsObject.saved || []
    //   state.theme = portsObject.theme || false

    //   if (state.theme) document.body.classList.add('dark')
    //   else document.body.classList.remove('dark')
    // }

    /** Watches state.port and state.address changes
     * @function watch - Formats port (0 to 65535) or address (000.000 to 255.255) in input element
     */
    watch(
      () => state.port,
      (port, prevPort) => {
        // if (!port.match(/^\d{0,5}/) || port.match(/^\d{0,5}/)[0].length == 0) {
        if (!port.match(/^\d{0,5}$/)) {
          state.port = prevPort
        }
        // else if (port.match(/^\d{6,}.*$/) || port.match(/[\s]/)) {
        //   state.port = prevPort
        // }
        if (port.length === 0) {
          state.port = ''
        }
        if (Number(port) > 65535) {
          state.port = prevPort
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
          const num = address.split('.')
          if (Number(num[1]) > 255) state.address = prevAddress
        } else if (address.match(/^\d{1,3}\.\d{1,3}\.\d{0,3}$/)) {
          const num = address.split('.')
          if (Number(num[2]) > 255) state.address = prevAddress
        } else if (address.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{0,3}$/)) {
          const num = address.split('.')
          if (Number(num[3]) > 255) state.address = prevAddress
        } else if (address.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{0,5}$/)) {
          const num = address.split(':')
          if (Number(num[1]) > 65535) state.address = prevAddress
          // } else if (address.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}\/.*$/) && !address.match(/[\s]/)) {
          //   // Matches only to avoid else condition
        } else {
          state.address = prevAddress
        }
        if (address.length === 0) {
          state.address = ''
        }
      }
    )

    onMounted(async () => {
      let portsInStorage
      try {
        portsInStorage = await LocalForage.getItem('porthost-data')
        if (portsInStorage) {
          state.recent = portsInStorage.recent || []
          state.saved = portsInStorage.saved || []
          state.theme = portsInStorage.theme || false
          // state.linkType = portsInStorage.linkType || false

          if (state.theme) document.body.classList.add('dark')
          else document.body.classList.remove('dark')
        }
      } catch (err) {
        console.error(err)
      }

      // Determines if device is a touchscreen device
      const isTouchDevice = () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
      }
      if (isTouchDevice()) {
        document.querySelector('main')?.classList.add('no-hover')
      }
    })

    onUpdated(() => {
      LocalForage.setItem('porthost-data', toRaw(state))
    })

    return {
      state,
    }
  },
  methods: {
    /** Toggles theme from light to dark
     * @function toggleTheme
     * True => Dark mode
     * False => Light mode
     */
    toggleTheme(theme) {
      this.state.theme = theme
      if (theme) document.body.classList.add('dark')
      else document.body.classList.remove('dark')
    },
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
        return `http://${item}`
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding-top: 60px;

  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}
header {
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    margin: 1rem;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.06);
    }
  }
  &:before,
  &:after {
    content: '';
    background-color: $almostBlack;
    height: 0.1rem;
    width: 20vw;
  }
}
.theme-switch-container {
  margin: 1rem;
  position: absolute;
  top: 0;
  right: 0;
  background-color: $almostBlack;
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.06);
  }

  .theme-switch {
    left: 2px;
    top: -2px;
    position: relative;

    button {
      padding: 0.2em;
      height: auto;
      width: 40px;
      height: 40px;
      margin: 0 auto;
      z-index: 1;
      position: relative;
      border-radius: 8px;
      border: 2px solid $almostBlack;
      font-size: 14px;
      cursor: pointer;
      background-color: whitesmoke;
      color: $almostBlack;

      &:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      &:last-child {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
      }
      &:hover {
        background: $almostBlack;
        color: white;
      }
    }
  }
}

.active {
  background: $almostBlack !important;
  color: whitesmoke !important;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;

  .link-switch {
    display: flex;
    align-items: center;

    div.link-switch-container {
      margin: 0rem;
      width: 8rem;
      display: flex;

      h3.link-type {
        display: inline-block;
        position: relative;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;

        &:after {
          content: '';
          position: absolute;
          background-color: $almostBlack;
          height: 0.1rem;
          left: 0;
          bottom: 0;
          width: 100%;
          transform: scaleX(0);
          transition: transform 0.1s linear;
          transform-origin: bottom center;
        }
        &:hover:after {
          transform: scaleX(1);
          transform-origin: bottom center;
        }
      }
    }
  }

  .links {
    display: flex;
    flex-direction: column;

    @media screen and (max-width: 414px) {
      div {
        display: flex;
        flex-direction: column;
      }
    }

    label {
      position: relative;
      top: 0.25rem;
      font-size: 2rem;
    }
    input {
      max-width: 15rem;
      font-size: 2rem;
      border: 2px solid rgb(238, 238, 238);
      margin-left: 4px;
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

.switch {
  --line: #505162;
  --dot: #747474;
  --circle: #9ea0be;
  --duration: 0.3s;
  --text: #9ea0be;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }

  input {
    display: none;
    & + div {
      position: relative;
      &:before,
      &:after {
        --s: 1;
        content: '';
        position: absolute;
        height: 4px;
        top: 10px;
        width: 24px;
        background: var(--line);
        transform: scaleX(var(--s));
        transition: transform var(--duration) ease;
      }
      &:before {
        --s: 0;
        left: 0;
        transform-origin: 0 50%;
        border-radius: 2px 0 0 2px;
      }
      &:after {
        left: 28px;
        transform-origin: 100% 50%;
        border-radius: 0 2px 2px 0;
      }
      span {
        padding-left: 56px;
        line-height: 24px;
        color: var(--text);
        &:before {
          --x: 0;
          --b: var(--circle);
          --s: 4px;
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          box-shadow: inset 0 0 0 var(--s) var(--b);
          transform: translateX(var(--x));
          transition: box-shadow var(--duration) ease, transform var(--duration) ease;
        }
        &:not(:empty) {
          padding-left: 64px;
        }
      }
    }
    &:checked {
      & + div {
        &:before {
          --s: 1;
        }
        &:after {
          --s: 0;
        }
        span {
          &:before {
            --x: 28px;
            --s: 12px;
            --b: var(--dot);
          }
        }
      }
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
  transition: transform 0.2s ease-in-out;

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
      color: black;
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
        color: $almostBlack;
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

// No hover for mobile devices
main.no-hover {
  .list-item-box {
    transform: scale(1);
    --show-btn-box: 1;

    &:hover {
      transform: scale(1);
      --show-btn-box: 1;
    }
  }
}

body {
  // Base styles
  height: 100%;
  margin: 0;
  background: white;
  color: $almostBlack;

  @media (prefers-color-scheme: dark) {
    background: black;
    color: whitesmoke;

    header:before,
    header:after {
      background-color: whitesmoke;
    }
    a {
      color: whitesmoke;
    }
    input {
      background-color: $almostBlack;
      border: 1px solid $almostBlack;
      color: whitesmoke;
    }
    h3.link-type:after {
      background-color: whitesmoke !important;
    }
  }

  @media (prefers-color-scheme: light) {
    background: white;
    color: $almostBlack;

    header:before,
    header:after {
      background-color: $almostBlack;
    }
    a {
      color: $almostBlack;
    }
    input {
      background-color: whitesmoke;
      border: 1px solid whitesmoke;
      color: $almostBlack;
    }
    h3.link-type:after {
      background-color: $almostBlack !important;
    }
  }

  // Dark mode
  &.dark {
    background: black;
    color: whitesmoke;

    header:before,
    header:after {
      background-color: whitesmoke;
    }
    a {
      color: whitesmoke;
    }
    input {
      background-color: $almostBlack;
      border: 1px solid $almostBlack;
      color: whitesmoke;
    }
    h3.link-type:after {
      background-color: whitesmoke !important;
    }
  }
}
</style>
