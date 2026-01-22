"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });
import "swagger-ui-react/swagger-ui.css";

export default function DocsPage() {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Suppress React strict mode warnings from swagger-ui-react
    // This is a known issue with the library using deprecated lifecycle methods
    // The warning is harmless and doesn't affect functionality
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || "";
      if (
        message.includes("UNSAFE_componentWillReceiveProps") ||
        message.includes("ModelCollapse")
      ) {
        // Suppress this specific warning from swagger-ui-react
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const message = args[0]?.toString() || "";
      if (
        message.includes("UNSAFE_componentWillReceiveProps") ||
        message.includes("ModelCollapse")
      ) {
        // Suppress this specific warning from swagger-ui-react
        return;
      }
      originalWarn.apply(console, args);
    };

    fetch("/api/docs")
      .then((res) => res.json())
      .then((data) => {
        setSpec(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Restore original console methods on unmount
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Error loading documentation: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="swagger-ui-wrapper">
      <SwaggerUI 
        spec={spec}
        deepLinking={true}
        displayRequestDuration={true}
        tryItOutEnabled={true}
        requestInterceptor={(request) => {
          // Enable CORS and ensure proper headers
          return request;
        }}
        responseInterceptor={(response) => {
          // Handle responses
          return response;
        }}
      />
      <style jsx global>{`
        .swagger-ui-wrapper {
          min-height: 100vh;
        }
        .swagger-ui .topbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
