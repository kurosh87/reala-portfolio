"use client"

import * as React from "react"
import {
  CameraIcon,
  Layers3Icon,
  MinusIcon,
  PlusIcon,
  RulerIcon,
  ShoppingCartIcon,
  Trash2Icon,
  VideoIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"

type CartItem = {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  icon: React.ElementType
}

const initialItems: CartItem[] = [
  {
    id: 1,
    name: "Listing Photography",
    description: "MLS-ready interior, exterior, and twilight selects",
    price: 425,
    quantity: 1,
    icon: CameraIcon,
  },
  {
    id: 2,
    name: "Matterport 3D Tour",
    description: "Interactive walkthrough with hosted property tour",
    price: 350,
    quantity: 1,
    icon: VideoIcon,
  },
  {
    id: 3,
    name: "Floor Plan Drafting",
    description: "Measured 2D floor plans for listing collateral",
    price: 195,
    quantity: 1,
    icon: RulerIcon,
  },
  {
    id: 4,
    name: "Feature Sheet Package",
    description: "Print-ready brochure and social media artwork",
    price: 275,
    quantity: 1,
    icon: Layers3Icon,
  },
]

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = React.useState(initialItems)

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems((items) => items.filter((item) => item.id !== id))
      return
    }

    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const serviceFee = subtotal * 0.08
  const total = subtotal + serviceFee
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="border-b md:mx-auto md:w-full md:max-w-xl">
          <DrawerTitle className="flex items-center justify-center gap-2 md:justify-start">
            <ShoppingCartIcon />
            Marketing Services Cart ({itemCount} items)
          </DrawerTitle>
          <DrawerDescription>
            Review listing services before creating the order.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="mx-auto max-h-[60vh] w-full max-w-xl">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <ShoppingCartIcon className="size-14 text-muted-foreground/40" />
              <div className="flex flex-col gap-1">
                <p className="font-medium">No services selected</p>
                <p className="text-sm text-muted-foreground">
                  Add photography, Matterport, floor plans, or print services.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {cartItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[auto_1fr] gap-3 rounded-lg border p-3 sm:grid-cols-[auto_1fr_auto_auto]"
                    >
                      <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                        <Icon />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <p className="mt-1 text-sm">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="col-start-2 flex items-center gap-2 sm:col-start-auto">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <MinusIcon />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <PlusIcon />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                      <div className="col-start-2 flex items-center justify-between gap-3 sm:col-start-auto sm:flex-col sm:items-end">
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2Icon />
                          <span className="sr-only">Remove service</span>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col gap-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service coordination</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2 border-t pt-4">
                <Input placeholder="Promo or office code" />
                <Button variant="outline">Apply</Button>
              </div>
            </>
          )}
        </DrawerBody>
        <DrawerFooter className="mx-auto grid w-full max-w-xl grid-cols-2 border-t">
          <DrawerClose asChild>
            <Button variant="outline">Continue Shopping</Button>
          </DrawerClose>
          <Button disabled={cartItems.length === 0}>
            Checkout (${total.toFixed(2)})
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
