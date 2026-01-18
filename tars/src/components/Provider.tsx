'use client';
import { ClerkProvider,useAuth, UserButton } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import { ThemeProvider } from "./theme-provider";
import Loading from "@/pages/auth/Loading";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const Provider = ({children} : {children : React.ReactNode}) =>{
    return(
        <ClerkProvider>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Authenticated>
                <UserButton/>
              {children}
              </Authenticated>
              <Unauthenticated>
                  UnAuthorized
              </Unauthenticated>
              <AuthLoading>
                <Loading/>
              </AuthLoading>
            </ThemeProvider>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}

