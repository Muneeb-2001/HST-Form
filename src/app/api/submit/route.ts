import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_API_URL = "https://api.airtable.com/v0";
const AIRTABLE_CONTENT_URL = "https://content.airtable.com/v0";

const N8N_WEBHOOK_URL =
  "https://n8n.domingogarcia.info/webhook/a91cd0c0-7a4b-498a-b186-a7785f52eff1";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const area = String(formData.get("area") || "").trim();
    const cvFile = formData.get("cv");

    if (!name || !email || !area || !(cvFile instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, area, and CV are required.",
        },
        { status: 400 }
      );
    }

    const token =
      process.env.AIRTABLE_TOKEN ||
      process.env.AIRTABLE_API_KEY;

    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || "Status Update";

    if (!token || !baseId) {
      console.error("Airtable environment variables are missing.");

      return NextResponse.json(
        {
          success: false,
          error: "Airtable configuration is missing.",
        },
        { status: 500 }
      );
    }

    /*
     * 1. Create Airtable record
     */
    const airtableResponse = await fetch(
      `${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Name: name,
            Email: email,
            Area: area,
            Date: new Date().toISOString(),
          },
        }),
      }
    );

    const airtableData = await airtableResponse.json();

    if (!airtableResponse.ok) {
      console.error("Airtable record creation failed:", airtableData);

      return NextResponse.json(
        {
          success: false,
          error:
            airtableData?.error?.message ||
            "Could not create Airtable record.",
        },
        { status: 500 }
      );
    }

    const airtableRecordId = airtableData.id;

    /*
     * 2. Upload CV into Airtable Attachment field
     */
    const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
    const cvBase64 = cvBuffer.toString("base64");

    const attachmentResponse = await fetch(
      `${AIRTABLE_CONTENT_URL}/${baseId}/${airtableRecordId}/Attachment/uploadAttachment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType: cvFile.type || "application/octet-stream",
          file: cvBase64,
          filename: cvFile.name,
        }),
      }
    );

    if (!attachmentResponse.ok) {
      const attachmentError = await attachmentResponse.text();

      console.error(
        "Airtable CV upload failed:",
        attachmentResponse.status,
        attachmentError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Airtable record was created, but CV upload failed.",
        },
        { status: 500 }
      );
    }

    /*
     * 3. Keep the existing n8n webhook
     *
     * The existing webhook continues receiving
     * the application information.
     */
    let webhookSent = false;

    try {
      const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          area,
          airtableRecordId,
          cvUploaded: true,
          cvFileName: cvFile.name,
          timestamp: new Date().toISOString(),
          source: "hst-form",
        }),
      });

      webhookSent = webhookResponse.ok;

      if (!webhookResponse.ok) {
        console.error(
          "n8n webhook returned:",
          webhookResponse.status,
          await webhookResponse.text()
        );
      }
    } catch (webhookError) {
      console.error("n8n webhook connection error:", webhookError);
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
      airtableRecordId,
      webhookSent,
    });
  } catch (error) {
    console.error("HST Form submission error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit application.",
      },
      { status: 500 }
    );
  }
}
