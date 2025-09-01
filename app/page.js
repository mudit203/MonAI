import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { featuresData, howItWorksData, statsData } from "@/Data/landing.js";
import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <div className="mt-40">
      <Hero />
      <section className="bg-blue-50 py-20" >
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-9">
            {statsData.map((item, index) => {

              return (<div className=" text-center" key={index}>
                <div className="text-5xl font-extrabold text-blue-600 mb-2 ">{item.value}</div>
                <div className="font-bold text-gray-600">{item.label}</div>
              </div>
              )
            })}

          </div>
        </div>
      </section>
      <section className="py-20">

        <div className="container mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-12">Everything you need to manage your finances</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {featuresData.map((item, index) => {
              return (
                <Card className="hover:shadow-2xl py-6">

                  <CardContent className="pt-4">
                    {item.icon}
                    <h3 className="font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-500">{item.description}</p>
                  </CardContent>

                </Card>

              )
            })}
          </div>

        </div>



      </section>
      <section className="py-20 bg-blue-50">

        <div className="container mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((item, index) => {
              return (
             <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">
{item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
             </div>

              )
            })}
          </div>

        </div>



      </section>
    </div>
  );
}
