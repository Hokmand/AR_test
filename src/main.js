let initialDistance = 0
const MIN_DISTANCE_THRESHOLD = 50
const zoomSpeed = 0.09

const zoomIn = function (model) {
  const prevSvale = model.getAttribute('scale')
  const newScale = {
    x: prevSvale.y + zoomSpeed,
    y: prevSvale.x + zoomSpeed,
    z: prevSvale.z + zoomSpeed,
  }
  model.setAttribute('scale', newScale)
}
const zoomOut = function (model) {
  const prevSvale = model.getAttribute('scale')
  const newScale = {
    x: prevSvale.y - zoomSpeed,
    y: prevSvale.x - zoomSpeed,
    z: prevSvale.z - zoomSpeed,
  }
  model.setAttribute('scale', newScale)
}

AFRAME.registerComponent('rotate-on-touch', {
  init: function () {
    this.touchStartX = 0
    this.touchStartY = 0
    this.rotationSpeed = 0.5
    this.modelRotation = this.el.getAttribute('rotation')
    this.isZooming = false

    this.el.sceneEl.addEventListener('touchstart', this.onTouchStart.bind(this))
    this.el.sceneEl.addEventListener('touchmove', this.onTouchMove.bind(this))
  },

  onTouchStart: function (event) {
    if (event.touches.length === 1) {
      this.isZooming = false
      this.touchStartX = event.touches[0].pageX
      this.touchStartY = event.touches[0].pageY
      this.modelRotation = Object.assign({}, this.el.getAttribute('rotation'))
    } else if (event.touches.length === 2) {
      this.isZooming = true
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      initialDistance = Math.hypot(
        touch2.pageX - touch1.pageX,
        touch2.pageY - touch1.pageY,
      )
    }
  },

  onTouchMove: function (event) {
    if (event.touches.length === 1 && !this.isZooming) {
      const touchX = event.touches[0].pageX
      const touchY = event.touches[0].pageY

      const deltaX = touchX - this.touchStartX
      const deltaY = touchY - this.touchStartY

      const rotationX = this.modelRotation.x - deltaY * this.rotationSpeed
      const rotationY = this.modelRotation.y - deltaX * this.rotationSpeed

      this.el.setAttribute('rotation', { x: rotationX, y: rotationY, z: 0 })
    } else if (event.touches.length === 2) {
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const currentDistance = Math.hypot(
        touch2.pageX - touch1.pageX,
        touch2.pageY - touch1.pageY,
      )

      const distanceChange = currentDistance - initialDistance

      if (Math.abs(distanceChange) >= MIN_DISTANCE_THRESHOLD) {
        if (distanceChange > 0) {
          zoomIn(this.el)
        } else {
          zoomOut(this.el)
        }

        initialDistance = currentDistance
      }
    }
  },
  onTouchEnd: function (event) {
    if (event.touches.length === 0) {
      this.isZooming = false
    }
  },
})

console.log('new version')