import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Services } from "@/components/Services";
import { Offers } from "@/components/Offers";
import { About } from "@/components/About";
import { Masters } from "@/components/Masters";
import { MastersGrid } from "@/components/MastersGrid";
import { Location } from "@/components/Location";
import { Reviews } from "@/components/Reviews";
import { Cta } from "@/components/Cta";
import { Admins } from "@/components/Admins";
import { Footer } from "@/components/Footer";
import {
  DEFAULT_ADMINS,
  DEFAULT_INFO,
  DEFAULT_MASTERS,
  DEFAULT_OFFERS,
  DEFAULT_SERVICES,
  getWriteChannels,
} from "@/lib/content";
import { getSheetData } from "@/lib/sheets";

export default async function Home() {
  const sheet = await getSheetData();
  const serviceItems = sheet?.services ?? DEFAULT_SERVICES;
  const masterItems = sheet?.masters ?? DEFAULT_MASTERS;
  const offerItems = sheet?.offers ?? DEFAULT_OFFERS;
  const adminItems =
    sheet?.admins && sheet.admins.length > 0 ? sheet.admins : DEFAULT_ADMINS;
  const salonPhotos = sheet?.salon ?? [];
  const info = sheet?.info ?? DEFAULT_INFO;
  const writeChannels = getWriteChannels(info);

  return (
    <>
      <Header
        phone={info.phone}
        phoneHref={info.phoneHref}
        hoursText={info.hoursText}
        writeChannels={writeChannels}
      />
      <main className="flex-1 overflow-x-clip">
        <div className="relative flex min-h-[100svh] flex-col">
          <Hero
            phone={info.phone}
            phoneHref={info.phoneHref}
            address={info.address}
            addressNote={info.addressNote}
          />
          <div className="mt-auto shrink-0">
            <Marquee />
          </div>
        </div>
        <Services items={serviceItems} />
        {offerItems.length > 0 ? <Offers items={offerItems} /> : null}
        <About />
        <Masters>
          <MastersGrid items={masterItems} />
        </Masters>
        <Location
          photos={salonPhotos}
          address={info.address}
          addressNote={info.addressNote}
        />
        <Reviews />
        <Cta writeChannels={writeChannels} />
        <Admins items={adminItems} />
      </main>
      <Footer info={info} />
    </>
  );
}
