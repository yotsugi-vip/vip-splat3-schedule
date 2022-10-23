import Image from 'next/image'

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
