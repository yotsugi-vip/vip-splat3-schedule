import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <div style={{ textAlign: "center" }}>VIP de Splatoon</div>
      <div style={{ display: "flex", justifyContent: "center" }} >
        <Image src="/schedule.jpg" width={960} height={640} objectFit={'contain'} alt='schedule' />
      </div>
    </div>
  )
}
