
import React from "react";
import StyledComponentsRegistry from '../lib/registry';
import "@decooio/crust-fonts/style.css";
import "semantic-ui-css/semantic.min.css";
import "../styles/global.css";
import { ClientRoot } from "./clientroot";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const URL = process.env.NEXT_PUBLIC_URL;
    return {
        title: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
        description:
            "Click to see what I am sharing on Crust Files - the personal Web3.0 storage application.",
        other: {
            "fc:frame": JSON.stringify({
                version: "next",
                imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
                button: {
                    title: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}`,
                    action: {
                        type: "launch_frame",
                        name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
                        url: URL,
                        splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE,
                        splashBackgroundColor:
                            process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
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
            <meta name="twitter:description" content="Click to see what I am sharing on Crust Files - the personal Web3.0 storage application." />
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