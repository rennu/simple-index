<template>
  <div class="container">
    <div class="section columns is-8">
      <div class="column">
        <h1 class="title">Folder Contents</h1>
      </div>
      <div class="column is-4">
        <p class="control has-icons-left has-icons-right">
          <input class="input is-rounded" v-model="searchString" v-on:keyup="this.onSearch" />
          <svg class="icon is-left"><use xlink:href="#search-g"></use></svg>
          <svg class="icon is-right has-fill-grey-light"><use class="clear-button" v-on:click="this.clearSearch" xlink:href="#cross-g"></use></svg>
        </p>
      </div>
    </div>
    <div class="section box is-raised">
      <div class="box">
        <span v-for="(breadcrumb, index) in breadCrumbs" class="breadcrumb" :key="`bc_${index}`">
          <a :href='`#path=${breadcrumb.path}`'><span style="color: #222222; font-weight: bold">/</span>{{ breadcrumb.text }}</a>
        </span>
      </div>
      <table class="table is-hoverable">
        <thead>
          <tr>
            <th class="cell-shrink">&nbsp;</th>
            <th>Name</th>
            <th class="cell-shrink">Last Modified</th>
          </tr>
        </thead>
        <tbody class="files" v-bind:class="{ hidden: isHidden }">

          <!--
            Loading...
          -->
          <tr v-if="loading">
            <td colspan="3">
              Loading...
            </td>
          </tr>

          <!--
            Messagebox
          -->
          <tr v-if="message.open">
            <td colspan="3">
              <div class="section">
                <div :class="`message has-text-centered ${message.addClass}`">
                  <h1 class='title'>{{ message.title }}</h1>
                  <p>
                    {{ message.message }}
                  </p>
                </div>
              </div>
            </td>
          </tr>

          <!--
            Return to parent directory
          -->
          <tr v-if="parent !== ''">
            <td>
              <a :href="parent">
                <svg class="image is-24x24"><use xlink:href="#key_return-g" style="visibility: visible"></use></svg>
              </a>
            </td>
            <td>
              <a :href="parent">Parent</a>
            </td>
            <td class="cell-shrink">
              <a :href="parent"></a>
            </td>
          </tr>

          <!--
            List files and directories
          -->
          <tr v-for="(item, index) in items" :key="`${item.name}_${index}`">
            <td>
              <a :href="item.destination">
                <svg class="image is-24x24"><use :xlink:href="`#${item.icon}`" style="visibility: visible"></use></svg>
              </a>
            </td>
            <td>
              <a :href="item.destination">{{item.name}}</a>
            </td>
            <td class="cell-shrink">
              <a :href="item.destination">{{item.time}}</a>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <p>
        {{ report.files }} files in {{ report.directories }} directories.
      </p>
      <p>
        Update: <code>tree -J -D --dirsfirst --timefmt '%H:%M:%S %d.%m.%Y' > files.json</code>
      </p>
    </div>
    <svg style="width: 0; height: 0" viewBox="0 0 24 24" id="briefcase-g"><path d="M19 6.5h-3v-1a3 3 0 00-3-3h-2a3 3 0 00-3 3v1H5a3 3 0 00-3 3v9a3 3 0 003 3h14a3 3 0 003-3v-9a3 3 0 00-3-3zm-9-1a1 1 0 011-1h2a1 1 0 011 1v1h-4v-1zm10 13a1 1 0 01-1 1H5a1 1 0 01-1-1V13a21.71 21.71 0 008 1.53A21.75 21.75 0 0020 13v5.5zm0-7.69a19.89 19.89 0 01-16 0V9.5a1 1 0 011-1h14a1 1 0 011 1v1.31z"></path></svg>
    <svg style="width: 0; height: 0" viewBox="0 0 24 24" id="document-g"><path d="M9 13a1 1 0 010-2h2a1 1 0 110 2H9zm0 4a1 1 0 010-2h6a1 1 0 110 2H9zm10.94-8.33c.03.088.05.178.06.27V19a3 3 0 01-3 3H7a3 3 0 01-3-3V5a3 3 0 013-3h6.06c.143 0 .264.02.364.06.103.047.243.162.326.24l6 6c.078.083.142.177.19.28v.09zM14 5.41V7a1 1 0 001 1h1.59L14 5.41zM18 19v-9h-3a3 3 0 01-3-3V4H7a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1z"></path></svg>
    <svg style="width: 0; height: 0" viewBox="0 0 24 24" id="key_return-g"><path d="M6.789 12.45h8.861a2.6 2.6 0 000-5.2 1 1 0 010-2 4.6 4.6 0 010 9.2H6.789l3.445 3.72a1 1 0 11-1.468 1.36l-5-5.4a1 1 0 010-1.36l5-5.4a1 1 0 111.468 1.36l-3.445 3.72z"></path></svg>
    <svg style="width: 0; height: 0" viewBox="0 0 24 24" id="search-g"><path d="M16.12 17.534a8.5 8.5 0 111.414-1.414l4.815 4.815a1 1 0 01-1.414 1.414l-4.815-4.815zm-5.262-.176a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"></path></svg>
    <svg style="width: 0; height: 0" viewBox="0 0 25 24" id="cross-g"><path fill-rule="evenodd" d="M12.5 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-11.374L9.908 8.035a.971.971 0 10-1.373 1.373L11.126 12l-2.591 2.592a.971.971 0 001.373 1.373l2.592-2.591 2.592 2.591a.971.971 0 001.373-1.373L13.874 12l2.591-2.592a.971.971 0 00-1.373-1.373L12.5 10.626z"></path></svg>
  </div>
</template>

<script>
import axios from 'axios'

function encodeURI (str) {
  str.replace('&', '%26')
    .replace('#', '%23')
  return str
}

export default {
  mounted: function () {
    this.getTree()
  },
  methods: {
    getTree: function () {
      this.loading = true
      this.isHidden = false
      axios.get('./files.json')
        .then(response => {
          this.loading = false
          if (response.status === 200) {
            const data = response.data
            if (data[0].type === 'report') {
              this.tree = data[1].contents
              this.report = data[0]
            } else {
              this.tree = data[0].contents
              this.report = data[1]
            }
            this.updateContent()
            window.onhashchange = this.updateContent.bind(this)
          } else if (response.status === 403) {
            throw new Error('Could not read files.json due to insufficient permission.')
          } else if (response.status === 404) {
            throw new Error('Could not find files.json. Did you create one?')
          } else {
            throw new Error('Shoot...Something really went wrong.')
          }
        })
        .catch(err => {
          console.log(err)
          this.setMessage(err)
        })
    },
    updateContent: function () {
      let bits = decodeURIComponent(window.location.hash.replace('#', '')).split('&')
      let newPath = []
      for (let bit of bits) {
        let [key, value] = bit.split('=')
        if (key === 'path') {
          if (value !== '') {
            newPath = decodeURI(value).split('/')
          }
          break
        }
      }
      this.path = newPath
      this.items = this.getDirectoryContent(0, this.tree)
    },
    getDirectoryContent: function (index, children) {
      if (index === this.path.length) {
        let _parentString = encodeURI(this.path.join('/'))

        return children.map(item => {
          let icon = 'document-g'
          let name = encodeURI(item.name)
          let destination = _parentString !== '' ? `./${_parentString}/${name}` : `./${name}`
          if (item.type === 'directory') {
            icon = 'briefcase-g'
            destination = _parentString !== '' ? `#path=${_parentString}/${name}` : `#path=${name}`
          }
          return { name: item.name, time: item.time, type: item.type, destination, icon }
        })
      } else {
        let dirName = this.path[index]
        for (let item of children) {
          if (item.type === 'directory' && item.name === dirName) {
            return this.getDirectoryContent(index + 1, item.contents)
          }
        }
        return []
      }
    },
    clearSearch: function () {
      this.searchString = ''
    },
    onSearch: function (event = {}) {
      if (event.keyCode === 13) {
        if (this.searchString.length === 0) {
          this.updateContent()
        } else {
          this.items = this.search(this.searchString, [], this.tree)
        }
      }
    },
    search: function (term, parent, children) {
      let found = []
      for (let item of children) {
        let _parent = parent.slice()
        if (item.name.toLowerCase().indexOf(term) > -1) {
          let icon = 'document-g'
          let _parentString = encodeURI(_parent.join('/'))
          let nameEncoded = encodeURI(item.name)
          let destination = _parentString !== '' ? `./${_parentString}/${name}` : `./${name}`
          if (item.type === 'directory') {
            icon = 'briefcase-g'
            destination = _parentString !== '' ? `#path=${_parentString}/${name}` : `#path=${name}`
          }
          
          found.push({ destination, name: item.name, time: item.time, type: item.type, icon, nameEncoded })
        }
        if (item.type === 'directory') {
          _parent.push(item.name)
          found = found.concat(this.search(term, _parent.slice(), item.contents))
        }
      }
      return found
    },
    setMessage: function (message = '', title = 'Error!', addClass = 'is-danger') {
      this.message = { message, title, addClass, open: true }
    }
  },
  watch: {
    path: function (path) {
      let parent = this.path.slice(0, this.path.length - 1).join('/')
      this.parent = path.length > 0 ? `#path=${parent}` : ''

      // Breadcrumbs
      let bc = [{ text: 'Root', path: '' }]
      let dTree = []
      for (let p of this.path.slice(0, this.path.length)) {
        dTree.push(p)
        bc.push({ text: `${p}`, path: dTree.join('/') })
      }
      this.breadCrumbs = bc
    }
  },
  data: () => {
    return ({
      isHidden: true,
      searchString: '',
      loading: false,
      message: {
        title: '',
        addClass: '',
        open: false
      },
      breadCrumbs: [],
      items: [],
      parent: '',
      path: [],
      tree: {},
      report: { files: 0, directories: 0 }
    })
  }
}
</script>

<style>
  table {
    width: 100%;
  }
  a {
    display: block;
    width: 100%;
  }
  .cell-shrink {
    width: 0.1%;
    white-space: nowrap;
  }
  .clear-button {
    pointer-events: auto;
    cursor: pointer;
  }
  .breadcrumb {
    float: left;
  }
  .hidden {
    display: none;
  }
</style>
