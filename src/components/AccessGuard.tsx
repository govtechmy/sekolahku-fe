import { Button } from "@govtechmy/myds-react/button";
import { LockIcon } from "@govtechmy/myds-react/icon";
import React, { useEffect, useState } from "react";

interface AccessGuardProps {
  correctCode: string; // The access code
  onAccessGranted: () => void; // Callback after success
}

const AccessGuard: React.FC<AccessGuardProps> = ({
  correctCode,
  onAccessGranted,
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // Auto-login if sessionStorage already approved
  useEffect(() => {
    const allowed = sessionStorage.getItem("dev_access_allowed");
    if (allowed === "true") {
      onAccessGranted();
    }
  }, [onAccessGranted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (code === correctCode) {
      sessionStorage.setItem("dev_access_allowed", "true");
      setError("");
      onAccessGranted();
    } else {
      setError("Invalid access code");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 px-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center">
        {/* Logo */}
        <img src="/JataNegara.svg" className="mx-auto mb-6 w-20 h-auto" />

        <h1 className="text-2xl font-semibold mb-2">Development Access</h1>
        <p className="text-gray-600 text-sm mb-6">
          This application is for development team access only.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          {error && <p className="text-txt-danger text-lg mb-4">{error}</p>}

          <Button
            variant="primary-fill"
            size="large"
            type="submit"
            className="w-full"
          >
            <div className="flex items-center w-full justify-center">
              <LockIcon />
              <div className="pl-2">Access Application</div>
            </div>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AccessGuard;
