import { Identity } from "@dfinity/agent";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { LogoutButton, useAuth, useCandidActor, useIdentities } from "@bundly/ares-react";

import { CandidActors } from "@app/canisters";
import Header from "@app/components/header";

type Profile = {
  username: string;
  bio: string;
};

type Tour = {
  id: string;
  name: string;
  description: string;
  category: string;
  availableSpots: number;
};


export default function IcConnectPage() {
  const { isAuthenticated, currentIdentity, changeCurrentIdentity } = useAuth();
  const identities = useIdentities();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [tours, setTours] = useState<Tour[]>([]);
  const [aboutUsContent, setAboutUsContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const test = useCandidActor<CandidActors>("test", currentIdentity, {
    canisterId: process.env.NEXT_PUBLIC_TEST_CANISTER_ID,
  }) as CandidActors["test"];

  useEffect(() => {
    if (currentIdentity) {
      getProfile();
      getAboutUs();
      getHomePageContent();
    }
  }, [currentIdentity]);

  function formatPrincipal(principal: string): string {
    const parts = principal.split("-");
    const firstPart = parts.slice(0, 2).join("-");
    const lastPart = parts.slice(-2).join("-");
    return `${firstPart}-...-${lastPart}`;
  }

  function disableIdentityButton(identityButton: Identity): boolean {
    return currentIdentity.getPrincipal().toString() === identityButton.getPrincipal().toString();
  }

  async function getProfile() {
    try {
      const response = await test.getProfile();

      if ("err" in response) {
        if ("userNotAuthenticated" in response.err) console.log("User not authenticated");
        else console.log("Error fetching profile");
      }

      const profile = "ok" in response ? response.ok : undefined;
      setProfile(profile);
    } catch (error) {
      console.error({ error });
    }
  }

  async function registerProfile(username: string, bio: string) {
    try {
      setLoading(true);
      const response = await test.createProfile(username, bio);

      if ("err" in response) {
        if ("userNotAuthenticated" in response.err) alert("User not authenticated");
        if ("profileAlreadyExists" in response.err) alert("Profile already exists");

        throw new Error("Error creating profile");
      }

      setProfile({ username, bio });
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }

  async function getAboutUs() {
    try {
      const content = await test.getAboutUsContent();
      setAboutUsContent(content);
    } catch (error) {
      console.error({ error });
    }
  }

  async function getHomePageContent() {
    try {
      const result = await test.getHomePageContent();
      console.log(result);
     // setTours(result);
    } catch (error) {
      console.error({ error });
    }
  }

  async function getTours() {
    try {
      const result = await test.getTours();
      console.log(result);
      //setTours(result);
    } catch (error) {
      console.error({ error });
    }
  }

  async function getToursByCategory(categoryId: string) {
    try {
      const result = await test.getToursByCategory(categoryId);
      console.log(result);
      //setTours(tours);
    } catch (error) {
      console.error({ error });
    }
  }

  async function processPayment(cardNumber: string, amount: number) {
    try {
        const bigintAmount = BigInt(amount); // Convertir amount a bigint
        const response = await test.processPayment(cardNumber, bigintAmount);
        if (response) {
            alert("Payment Successful");
        } else {
            alert("Payment Failed");
        }
    } catch (error) {
        console.error({ error });
        alert("Payment Error");
    }
}

  useEffect(() => {
    getTours();
  
  }, []);


  return (
    <>
      <Header />
      <main className="p-6">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            
            <div className="footer-menu">
            <ul>
                <li><a href="#">Inicio</a></li>
                <li><a href="#">Buscar</a></li>
                <li><a href="#">Recomendaciones</a></li>
                <li><a href="#">Sobre Nosotros</a></li>
                <li><a href="#">Perfil</a></li>
            </ul>
        </div>
    
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">Identities</h2>
              <ul className="divide-y divide-gray-200">
                {identities.map((identity, index) => (
                  <li key={index} className="flex items-center justify-between py-4">
                    <span className="text-gray-900">
                      {identity.provider} : {formatPrincipal(identity.identity.getPrincipal().toString())}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className={`px-3 py-1 text-sm rounded-md ${
                          disableIdentityButton(identity.identity)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white"
                        }`}
                        disabled={disableIdentityButton(identity.identity)}
                        onClick={() => changeCurrentIdentity(identity.identity)}>
                        Select
                      </button>
                      <LogoutButton identity={identity.identity} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-bold mb-2">About Us</h2>
            <p>{aboutUsContent}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-bold mb-2">Tours</h2>
            <ul>
              {tours.map((tour) => (
                <li key={tour.id} className="mb-2">
                  <strong>{tour.name}</strong>: {tour.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <div>
        
      </div>
    </>
  );
};
