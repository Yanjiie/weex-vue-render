/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import './style.css'

function getSwitch (weex) {
  const { extractComponentStyle } = weex
  const { dispatchNativeEvent } = weex.utils

  return {
    name: 'weex-switch',
    props: {
      checked: {
        type: [Boolean, String],
        default: false
      },
      disabled: {
        type: [Boolean, String],
        default: false
      },
      // Border color  when the switch is turned off
      tintColor: String,
      // Background color when the switch is turned on.
      onTintColor: String,
      // Color of the foreground switch grip.
      thumbTintColor: String
    },
    data () {
      return {
        isChecked: (this.checked !== 'false' && this.checked !== false),
        isDisabled: (this.disabled !== 'false' && this.disabled !== false)
      }
    },
    computed: {
      wrapperClass () {
        const classArray = ['weex-el', 'weex-switch']
        this.isChecked && classArray.push('weex-switch-checked')
        this.isDisabled && classArray.push('weex-switch-disabled')
        return classArray.join(' ')
      },
      mergeStyle () {
        const style = extractComponentStyle(this)
        const { tintColor, onTintColor, isChecked, isDisabled } = this

        if (!isChecked && tintColor) {
          Object.assign(style, {
            borderColor: tintColor,
            boxShadow: `${tintColor} 0 0 0 0 inset`
          })
        }

        if (isChecked && onTintColor) {
          Object.assign(style, {
            backgroundColor: onTintColor,
            color: onTintColor,
            borderColor: onTintColor,
            boxShadow: `${onTintColor} 0 0 0 0.533333rem inset`
          })
        }

        isDisabled && Object.assign(style, {
          opacity: 0.3
        })

        return style
      },
      smallStyle () {
        const { thumbTintColor } = this
        let smallStyle = {}

        if (thumbTintColor) {
          smallStyle = {
            background: thumbTintColor
          }
        }
        return smallStyle
      }
    },
    methods: {
      toggle () {
        // TODO: handle the events
        if (!this.isDisabled) {
          this.isChecked = !this.isChecked
          dispatchNativeEvent(this.$el, 'change', { value: this.isChecked })
        }
      }
    },

    mounted () {
      const el = this.$el
      if (el && el.nodeType === 1) {
        if (!this._removeClickHandler) {
          const handler = evt => {
            this.toggle()
          }
          this._removeClickHandler = el.removeEventListener.bind(el, 'weex$tap', handler)
          el.addEventListener('weex$tap', handler)
        }
      }
    },

    beforeDestroy () {
      const rm = this._removeClickHandler
      if (rm) {
        rm()
        delete this._removeClickHandler
      }
    },

    render (createElement) {
      return createElement('span', {
        attrs: { 'weex-type': 'switch' },
        staticClass: this.wrapperClass,
        staticStyle: this.mergeStyle
      }, [createElement('small', {
        staticClass: 'weex-switch-inner',
        staticStyle: this.smallStyle
      })])
    }
  }
}

export default {
  init (weex) {
    weex.registerComponent('switch', getSwitch(weex))
  }
}
