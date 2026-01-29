import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, type FormikHelpers } from "formik";
import { fabricService } from "@/modules/admin/fabrics/services/fabric.service";
import { fabricStockService } from "@/modules/admin/fabrics/services/fabricStock.service";
import { Button } from "@/modules/shared";
import { TextField, SelectField } from "@/modules/shared";
import { notify } from "@/modules/shared";
import { format } from "date-fns";
import type { FabricStockFormData } from "@/modules/shared";
import { STOCK_TYPES, type StockType } from "@/modules/shared";
import { fabricStockFormSchema } from "@/modules/shared";

type StockFormValues = {
  type: StockType | "";
  quantity: number | string;
  reference: string;
};

const INITIAL_VALUES: StockFormValues = {
  type: "",
  quantity: "",
  reference: "",
};

export default function FabricStockPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: fabric, isLoading } = useQuery({
    queryKey: ["fabric", id],
    queryFn: () => fabricService.getById(id!),
    enabled: !!id,
  });

  const addStockMutation = useMutation({
    mutationFn: (data: FabricStockFormData) => fabricStockService.create(data),
    onSuccess: () => {
      notify.success("Stock transaction added successfully");
      queryClient.invalidateQueries({ queryKey: ["fabric", id] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      notify.error(
        error.response?.data?.message || "Failed to add stock transaction",
      );
    },
  });

  const handleSubmit = async (
    values: StockFormValues,
    { resetForm }: FormikHelpers<StockFormValues>,
  ) => {
    if (!id) return;

    const payload: FabricStockFormData = {
      fabric_id: id,
      type: values.type as "IN" | "OUT",
      quantity: Number(values.quantity),
      reference: values.reference || null,
    };

    try {
      await addStockMutation.mutateAsync(payload);
      resetForm();
    } catch {
      // onError already handled by mutation; keep form state for correction.
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!fabric) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Fabric not found</div>
      </div>
    );
  }

  const sortedStocks = [...(fabric.stocks || [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const deltas = sortedStocks.map((stock) =>
    stock.type === "IN" ? Number(stock.quantity) : -Number(stock.quantity),
  );
  const totalBalance = deltas.reduce((acc, delta) => acc + delta, 0);
  const prefixSums = deltas.reduce<number[]>((acc, delta, index) => {
    const next = (acc[index - 1] ?? 0) + delta;
    return [...acc, next];
  }, []);
  const stockRows = sortedStocks.map((stock, index) => ({
    stock,
    runningBalance: totalBalance - (prefixSums[index - 1] ?? 0),
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/admin/fabrics/${id}`}
          className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
        >
          ← Back to Fabric
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Stock Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {fabric.fabric_no} - {fabric.supplier?.company_name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              {fabric.available_balance ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Add Stock Transaction Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Add Stock Transaction
          </h3>
        </div>
        <div className="px-6 py-5">
          <Formik<StockFormValues>
            initialValues={INITIAL_VALUES}
            validationSchema={fabricStockFormSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <SelectField
                    name="type"
                    label="Transaction Type"
                    required
                    options={STOCK_TYPES.map((type) => ({
                      label:
                        type === "IN"
                          ? "Stock In (Receive)"
                          : "Stock Out (Issue)",
                      value: type,
                    }))}
                  />

                  <TextField
                    name="quantity"
                    label="Quantity"
                    type="number"
                    required
                    placeholder="0.00"
                  />

                  <TextField
                    name="reference"
                    label="Reference"
                    placeholder="Challan #, Order #, etc."
                  />
                </div>

                {values.type === "OUT" &&
                  fabric.available_balance !== undefined && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Note:</span> Available
                      balance: {fabric.available_balance}. Ensure OUT quantity
                      doesn't exceed this.
                    </div>
                  )}

                <div className="flex gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Transaction"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Stock History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Transaction History
          </h3>
        </div>
        <div className="overflow-x-auto">
          {sortedStocks.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No transactions yet
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Running Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockRows.map(({ stock, runningBalance }) => (
                    <tr key={stock.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(stock.created_at), "PPp")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            stock.type === "IN"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {stock.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                        {stock.type === "IN" ? "+" : "-"}
                        {Number(stock.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {stock.reference || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                        {runningBalance.toFixed(2)}
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
