import Image from 'next/image'

export default function Home() {
  return (
    <div >
      <br />
      <x-sign style={{ textAlign: "center", fontSize: "70px" }}>
        VIP de Splatoon
      </x-sign>
      <x-sign id="welcome" style={{ textAlign: "center", fontSize: "30px" }}>
        welcome to underground
      </x-sign>

      <x-sign id="welcome" style={{ textAlign: "center", fontSize: "30px" }}>
        <a href="https://mi.5ch.net/news4vip/">
          https://mi.5ch.net/news4vip/

        </a>
      </x-sign>

      <br />

      <div style={{ display: "flex", justifyContent: "center" }} >
        <Image src="/schedule.jpg" width={2240} height={1940 * 0.8} objectFit={'contain'} alt='schedule' />
      </div>
    </div>
  )
}
