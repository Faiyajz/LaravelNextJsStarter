import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { format } from "date-fns";

import { buyerService } from "@/modules/admin/buyers/services/buyer.service";
import { Button, notify } from "@/modules/shared";
import type { Buyer } from "@/modules/shared";

export default function BuyerViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBuyer = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await buyerService.getById(id);
        setBuyer(data);
      } catch {
        notify.error("Failed to load buyer");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuyer();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this buyer?")) return;

    try {
      await buyerService.delete(id);
      notify.success("Buyer deleted successfully");
      navigate("/admin/buyers");
    } catch {
      notify.error("Failed to delete buyer");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Buyer not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/admin/buyers"
            className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Buyers
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900">
            {buyer.user?.name ?? "Buyer"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {buyer.user?.email ?? "-"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to={`/admin/buyers/${id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Buyer Profile</h3>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Company</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {buyer.company_name}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Country</dt>
              <dd className="mt-1 text-sm text-gray-900">{buyer.country}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {buyer.phone || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Joined Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(buyer.created_at), "MMM d, yyyy")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
