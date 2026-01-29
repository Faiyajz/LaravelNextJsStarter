<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Fabric Barcode</title>

    <style>
        :root {
            --border: #e5e7eb;
            --text: #111827;
            --muted: #6b7280;
            --bg: #ffffff;
            --shadow: 0 8px 24px rgba(0, 0, 0, .08);
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 24px;
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Helvetica Neue", Helvetica, sans-serif;
            color: var(--text);
            background: #f3f4f6;
        }

        /* Wrapper */
        .page {
            max-width: 520px;
            margin: 0 auto;
        }

        /* Label card */
        .label {
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            box-shadow: var(--shadow);
            overflow: hidden;
        }

        .label__header {
            padding: 14px 16px;
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        .label__title {
            font-size: 14px;
            font-weight: 700;
            letter-spacing: .2px;
            margin: 0;
        }

        .label__badge {
            font-size: 11px;
            font-weight: 600;
            color: var(--muted);
            border: 1px solid var(--border);
            border-radius: 999px;
            padding: 4px 10px;
            white-space: nowrap;
        }

        .label__body {
            padding: 14px 16px 16px;
        }

        /* Meta grid */
        .meta {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 14px;
        }

        .meta__row {
            display: grid;
            grid-template-columns: 120px 1fr;
            gap: 10px;
            align-items: start;
        }

        .meta__key {
            font-size: 12px;
            color: var(--muted);
            font-weight: 600;
            line-height: 1.25;
        }

        .meta__val {
            font-size: 12px;
            font-weight: 600;
            line-height: 1.35;
            word-break: break-word;
        }

        /* Barcode area */
        .barcode {
            border-top: 1px dashed var(--border);
            padding-top: 14px;
            text-align: center;
        }

        .barcode__value {
            margin-top: 8px;
            font-size: 12px;
            color: var(--muted);
            letter-spacing: .6px;
        }

        /* Actions */
        .actions {
            margin-top: 12px;
            display: flex;
            justify-content: flex-end;
        }

        .btn {
            appearance: none;
            border: 1px solid var(--border);
            background: #111827;
            color: #fff;
            font-size: 12px;
            font-weight: 700;
            padding: 10px 14px;
            border-radius: 10px;
            cursor: pointer;
        }

        .btn:active {
            transform: translateY(1px);
        }

        /* Print styles */
        @media print {
            body {
                background: #fff;
                padding: 0;
            }

            .page {
                max-width: none;
                margin: 0;
            }

            .label {
                box-shadow: none;
                border-radius: 0;
                border: 1px solid #000;
            }

            .actions {
                display: none;
            }

            /* Optional: set a label-like print size (uncomment if you need strict sizing)
            @page { size: 80mm 50mm; margin: 4mm; }
            .label { width: 80mm; }
            */
        }
    </style>
</head>

<body>
    <div class="page">
        <div class="label">
            <div class="label__header">
                <p class="label__title">Fabric Barcode Label</p>
                <span class="label__badge">Code 128</span>
            </div>

            <div class="label__body">
                <div class="meta">
                    <div class="meta__row">
                        <div class="meta__key">Supplier</div>
                        <div class="meta__val">{{ $fabric->supplier->company_name }}</div>
                    </div>

                    <div class="meta__row">
                        <div class="meta__key">Fabric No</div>
                        <div class="meta__val">{{ $fabric->fabric_no }}</div>
                    </div>

                    <div class="meta__row">
                        <div class="meta__key">Composition</div>
                        <div class="meta__val">{{ $fabric->composition }}</div>
                    </div>

                    <div class="meta__row">
                        <div class="meta__key">Barcode</div>
                        <div class="meta__val">{{ $barcode->barcode_value }}</div>
                    </div>
                </div>

                <div class="barcode">
                    @php $dns1d = new \Milon\Barcode\DNS1D(); @endphp
                    {!! $dns1d->getBarcodeHTML($barcode->barcode_value, 'C128', 2, 70) !!}
                    <div class="barcode__value">{{ $barcode->barcode_value }}</div>
                </div>

                <div class="actions">
                    <button class="btn" type="button" onclick="window.print()">Print</button>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
