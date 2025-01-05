import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

export function usePathAnimation(pathRef, pointRef) {
  onMounted(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)
    
    const path = pathRef.value
    const point = pointRef.value
    const l = path.getTotalLength()

    gsap.set(path, { 
      strokeDasharray: l, 
      strokeDashoffset: l 
    })

    gsap.to(path, {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: ".container",
        start: "top top",
        end: "bottom 5%",
        scrub: true,
        markers: true,
      },
    })

    gsap.set(point, {
      motionPath: {
        path: path,
        align: path,
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
        start: 0
      }
    })

    gsap.to(point, {
      ease: "none",
      motionPath: {
        path: path,
        align: path,
        alignOrigin: [0.5, 0.5],
        autoRotate: true
      },
      scrollTrigger: {
        trigger: ".container",
        start: "top top",
        end: "bottom 5%",
        scrub: true
      }
    })
  })
}