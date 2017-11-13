'use strict'

import ElementUI from 'element-ui'
import Vue from 'vue'
import Component from 'vue-class-component'

import {
  Configuration,
  loadConfigFromBackground,
  Pattern,
  saveConfigForBackground,
} from '../config'

import './App.scss'

// ----------------------------------------------------------------------------

@Component({
  template: require('./App.html'),
})
export default class AppComponent extends Vue {
  public rules = {
    owner: [
      { required: true, message: '所有者は必ず指定してください。', trigger: 'change' },
    ],
  }

  public config = Configuration.empty()
  public pattern = Pattern.empty()
  public patterns: Pattern.T[] = []

  public async mounted() {
    this.config = await loadConfigFromBackground()
    this.patterns = this.config.exclude
  }

  public submitForm(formName: string) {
    const form = this.$refs[formName] as ElementUI.Form
    form.validate(async valid => {
      if (!valid) return false

      this.patterns.push({ ...this.pattern })
      form.resetFields()

      await saveConfigForBackground(this.config)
      if (DEBUG) {
        console.log('saved', this.config)
      }

      const input = this.$refs.owner as ElementUI.Input
      const elem = input.$el.querySelector('input')
      if (elem) elem.focus()
    })
  }

  public async handleDelete(index: number) {
    this.patterns.splice(index, 1)

    await saveConfigForBackground(this.config)
    if (DEBUG) {
      console.log('saved', this.config)
    }
  }
}
