"use client";

import UnverifiedAccount from "@/src/components/UnverifiedAccount";
import LoginPage from "@/src/components/LoginPage";
import { useState } from "react";


export default function page() {
  const [unverifiedUser, setUnverifiedUser] = useState(null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      {unverifiedUser ? (
        <UnverifiedAccount
          user={unverifiedUser}
          onBack={() => setUnverifiedUser(null)}
        />
      ) : (
        <LoginPage onUnverified={(user) => setUnverifiedUser(user)} />
      )}
    </main>
  );
}