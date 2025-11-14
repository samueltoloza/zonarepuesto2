import { StockFilters } from "@/components"
import StockTable from "@/components/Inventory/StockTable"

export default function page() {
    return (
        <>
            <StockFilters />
            <StockTable />
        </>
    )
}
