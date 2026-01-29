import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supplierService } from "@/modules/admin/suppliers/services/supplier.service";
import NotesList from "@/modules/admin/components/NotesList";
import { Button } from "@/modules/shared";
import { notify } from "@/modules/shared";
import { format } from "date-fns";
import type { Supplier } from "@/modules/shared";

export default function SupplierViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await supplierService.getById(id);
        setSupplier(data);
      } catch {
        notify.error("Failed to load supplier");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  const refetchSupplier = async () => {
    if (!id) return;

    try {
      const data = await supplierService.getById(id);
      setSupplier(data);
    } catch {
      notify.error("Failed to reload supplier");
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (!confirm("Are you sure you want to delete this supplier?")) {
      return;
    }

    try {
      await supplierService.delete(id);
      notify.success("Supplier deleted successfully");
      navigate("/admin/suppliers");
    } catch {
      notify.error("Failed to delete supplier");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Supplier not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/admin/suppliers"
            className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Suppliers
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900">
            {supplier.company_name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Code: {supplier.code}</p>
        </div>
        <div className="flex gap-3">
          <Link to={`/admin/suppliers/${id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Supplier Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Supplier Information
          </h3>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Country</dt>
              <dd className="mt-1 text-sm text-gray-900">{supplier.country}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Company Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {supplier.company_name}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Supplier Code
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{supplier.code}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {supplier.email || "-"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {supplier.phone || "-"}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {supplier.address || "-"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Representative Information */}
      {(supplier.representative_name ||
        supplier.representative_email ||
        supplier.representative_phone) && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Representative Information
            </h3>
          </div>
          <div className="px-6 py-5">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {supplier.representative_name || "-"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {supplier.representative_email || "-"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {supplier.representative_phone || "-"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Additional Information
          </h3>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(supplier.created_at), "PPP")}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Updated At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(supplier.updated_at), "PPP")}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Notes</h3>
        </div>
        <div className="px-6 py-5">
          <NotesList
            noteableType="supplier"
            noteableId={supplier.id}
            notes={supplier.notes || []}
            onNoteAdded={refetchSupplier}
          />
        </div>
      </div>
    </div>
  );
}
