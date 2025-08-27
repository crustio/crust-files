
import React from "react";
import StyledComponentsRegistry from '../lib/registry';
import "@decooio/crust-fonts/style.css";
import "semantic-ui-css/semantic.min.css";
import "../styles/global.css";
import { ClientRoot } from "./clientroot";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Crust Files",
        description:
            "Your first personal Web3.0 storage",
        other: {
            "fc:frame": JSON.stringify({
                version: "next",
                imageUrl: "https://crustfiles.io/share.jpg",
                button: {
                    title: `Launch Crust Files`,
                    action: {
                        type: "launch_frame",
                        name: "Crust Files",
                        url: "https://crustfiles.io",
                        splashImageUrl: "https://crustfiles.io/logo.png",
                        splashBackgroundColor: "#ffffff",
                    },
                },
            }),
        },
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@CrustNetwork" />
            <meta name="twitter:creator" content="@CrustNetwork" />
            <meta name="twitter:title" content="Crust Files" />
            <meta name="twitter:description" content="Your first personal Web3.0 storage" />
            <meta name="twitter:image" content="https://gw.crustfiles.net/ipfs/QmfPTVDtSGuCp2mftrZdQE4Mf5FeYT1gYTiL9xTXoSEgqz?filename=Crust%20Files.png" />
        </head>
        <body>
            <StyledComponentsRegistry>
                <ClientRoot>
                    {children}
                </ClientRoot>
            </StyledComponentsRegistry>
        </body>
    </html>
}