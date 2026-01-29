import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fabricService } from "@/modules/admin/fabrics/services/fabric.service";
import NotesList from "@/modules/admin/components/NotesList";
import { Button } from "@/modules/shared";
import { notify } from "@/modules/shared";
import { format } from "date-fns";
import type { Fabric } from "@/modules/shared";

export default function FabricViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fabric, setFabric] = useState<Fabric | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFabric = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await fabricService.getById(id);
        setFabric(data);
      } catch {
        notify.error("Failed to load fabric");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFabric();
  }, [id]);

  const refetchFabric = async () => {
    if (!id) return;

    try {
      const data = await fabricService.getById(id);
      setFabric(data);
    } catch {
      notify.error("Failed to reload fabric");
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (!confirm("Are you sure you want to delete this fabric?")) {
      return;
    }

    try {
      await fabricService.delete(id);
      notify.success("Fabric deleted successfully");
      navigate("/admin/fabrics");
    } catch {
      notify.error("Failed to delete fabric");
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/admin/fabrics"
            className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Fabrics
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900">
            {fabric.fabric_no}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {fabric.supplier?.company_name || "No Supplier"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to={`/admin/fabrics/${id}/stock`}>
            <Button>Manage Stock</Button>
          </Link>
          <Link to={`/admin/fabrics/${id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Fabric Image */}
      {fabric.image_path && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Fabric Image</h3>
          </div>
          <div className="px-6 py-5">
            <img
              src={`${import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage"}/${fabric.image_path}`}
              alt={fabric.fabric_no}
              className="w-full max-w-2xl h-auto rounded-lg border border-gray-300 shadow-sm"
            />
          </div>
        </div>
      )}

      {/* Fabric Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Fabric Information
          </h3>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Fabric Number
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{fabric.fabric_no}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Supplier</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.supplier?.company_name || "-"}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Composition</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.composition}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">GSM</dt>
              <dd className="mt-1 text-sm text-gray-900">{fabric.gsm}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Initial Quantity
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{fabric.qty}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Available Balance
              </dt>
              <dd className="mt-1 text-sm text-gray-900 font-semibold">
                {fabric.available_balance ?? 0}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Cuttable Width
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.cuttable_width}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Production Type
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.production_type}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Construction
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.construction || "-"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Color/Pantone Code
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.color_pantone_code || "-"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Weave Type</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.weave_type || "-"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Finish Type</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.finish_type || "-"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Dyeing Method
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.dyeing_method || "-"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Printing Method
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.printing_method || "-"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Lead Time</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.lead_time ? `${fabric.lead_time} days` : "-"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">MOQ</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.moq || "-"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Shrinkage</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.shrinkage_percent
                  ? `${fabric.shrinkage_percent}%`
                  : "-"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Selected By</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {fabric.fabric_selected_by || "-"}
              </dd>
            </div>

            {fabric.remarks && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Remarks</dt>
                <dd className="mt-1 text-sm text-gray-900">{fabric.remarks}</dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(fabric.created_at), "PPpp")}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Updated At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(fabric.updated_at), "PPpp")}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Barcodes */}
      {fabric.barcodes && fabric.barcodes.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Barcodes</h3>
          </div>
          <div className="px-6 py-5">
            <div className="space-y-4">
              {fabric.barcodes.map((barcode) => (
                <div
                  key={barcode.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {barcode.barcode_value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {format(new Date(barcode.created_at), "PPpp")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const printUrl = `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:8000"}/api/fabrics/${id}/barcodes/${barcode.id}/print`;
                      window.open(printUrl, "_blank");
                    }}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Print Barcode
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Notes</h3>
        </div>
        <div className="px-6 py-5">
          <NotesList
            noteableType="fabric"
            noteableId={id!}
            notes={fabric.notes || []}
            onNoteAdded={refetchFabric}
          />
        </div>
      </div>
    </div>
  );
}
