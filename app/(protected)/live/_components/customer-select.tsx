import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/server/trpc/client';
import { Badge, Plus, Search, User } from 'lucide-react';
import { useState } from 'react';
import { useInvoiceStore } from '../_stores/invoiceStore';
import { useDebounce } from '@/hooks/use-Debounce';

const CustomerSelectBar = () => {
    const [customerInput, setCustomerInput] = useState("") // New state for customer input
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false) // New state for dropdown visibility
    const debouncedInput = useDebounce(customerInput, 300);

    const { selectedCustomer, actions } = useInvoiceStore();
    const { data, isLoading } = trpc.customer.getList.useQuery({ name: debouncedInput });
    const filteredCustomers = data?.payload ?? []

    return (
        <div className="bg-white/90 backdrop-blur-sm border-b border-rose-200 px-4 py-3 relative z-[10]">
            {!selectedCustomer ? (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Type customer name or phone..."
                        value={customerInput}
                        onChange={(e) => {
                            setCustomerInput(e.target.value);
                            setShowCustomerDropdown(true);
                        }}
                        onFocus={() => setShowCustomerDropdown(true)}
                        onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 100)}
                        className="pl-10 border-rose-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl h-12"
                    />
                    {customerInput && showCustomerDropdown && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-rose-200 rounded-xl shadow-lg mt-2 z-[10] max-h-60 overflow-y-auto">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <Button
                                        key={customer.id}
                                        variant="ghost"
                                        onClick={() => {
                                            actions.setSelectedCustomer(customer);
                                            setCustomerInput(customer.name);
                                            setShowCustomerDropdown(false);
                                        }}
                                        className="w-full justify-start hover:bg-rose-50 rounded-lg p-3 h-auto"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                                                <User className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">{customer.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No matching customers.
                                </div>
                            )}
                            {customerInput && !filteredCustomers.some(c => c.name.toLowerCase() === customerInput.toLowerCase()) && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        actions.setSelectedCustomer({ id: `new-${Date.now()}`, name: customerInput });
                                        setShowCustomerDropdown(false);
                                    }}
                                    className="w-full justify-start hover:bg-rose-50 rounded-lg p-3 h-auto border-t border-rose-100"
                                >
                                    <Plus className="h-4 w-4 mr-2 text-rose-600" />
                                    <span className="font-medium text-rose-600">Add "{customerInput}" as New Customer</span>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50 p-3 rounded-xl border border-rose-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{selectedCustomer.name}</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            actions.setSelectedCustomer(null);
                            setCustomerInput("");
                        }}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Change
                    </Button>
                </div>
            )}
        </div>
    )
}

export default CustomerSelectBar