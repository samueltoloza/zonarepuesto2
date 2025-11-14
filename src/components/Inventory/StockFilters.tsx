"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { getHeadquarterOptions } from "@/app/protected/headquarter/actions/headquarter"
import { useHeadquarterStore } from "@/store/useHeadquarterStore"

export function StockFilters() {
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<{ label: string; value: string; }[] | null>(null)
    const [selectedStatus, setSelectedStatus] = useState<{ label: string; value: string; } | null>(null)
    const { headquarterId, setHeadquarterId } = useHeadquarterStore()

    useEffect(() => {
        (async () => {
            const options = await getHeadquarterOptions();
            setOptions(options);
        })()
    }, [selectedStatus])

    console.log(selectedStatus);

    return (
        <div className="flex items-center space-x-4">
            <p className="text-muted-foreground text-sm">Local</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[150px] justify-start">
                        {selectedStatus ? <>{selectedStatus.label}</> : <>Seleccionar local</>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                        <CommandInput placeholder="Change status..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {options && options.map((status) => (
                                    <CommandItem
                                        key={status.value}
                                        value={status.value}
                                        onSelect={(value) => {
                                            setHeadquarterId(value);
                                            setSelectedStatus(
                                                options.find((option) => option.value === value) ||
                                                null
                                            )
                                            setOpen(false)
                                        }}
                                    >
                                        {status.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
