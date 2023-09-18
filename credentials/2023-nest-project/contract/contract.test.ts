import { Options, compact } from "jsonld"
import credential from "./contract-credential.json"
// import dataDisplay from "./device-info-data-display.json"
import schema from "./contract-credential.json"
import { issueAndVerify } from "../../../test/issue-and-verify"
import {
  digitalBazaarDocumentLoader,
  transmuteDocumentLoader,
} from "../../2022-neo/neo-document-loader"
// import { verifyDataDisplayStructure } from "../../../test/verify-data-display-structure"
import { verifyCredentialSubjectSchema } from "../../../test/verify-credential-subject-schema"

describe("Contract", () => {
  test("Credential should match JSON Schema", async () => {
    verifyCredentialSubjectSchema(schema, credential)
  })

  test("Credential can be issued and verified", async () => {
    await issueAndVerify(credential, transmuteDocumentLoader)
  })

  test("Compacted credential is as expected", async () => {
    const options: Options.Compact = {
      documentLoader: digitalBazaarDocumentLoader,
    }
    const compacted = await compact(credential, {}, options)
    const expected = {
      "@id": "<some URI, e.g. https://elia.be/credential/1>",
      "@type": [
        "https://www.w3.org/2018/credentials#VerifiableCredential",
        "https://vc-context.elia.be/2022/v1/ContractCredential",
      ],
      "https://www.w3.org/2018/credentials#credentialSubject": {
        "@id": "contractIdScheme:456",
        "@type": "Contract",
        "https://vc-context.elia.be/2022/v1/Contract/applicationLaw":
          "Belgium laws",
        "https://vc-context.elia.be/2022/v1/Contract/compensationOfTheOffer":
          "0",
        "https://vc-context.elia.be/2022/v1/Contract/contractedItem": {
          "@id": "deviceIdScheme:123",
          "@type": "https://vc-context.elia.be/2022/v1/Device",
        },
        "https://vc-context.elia.be/2022/v1/Contract/expressionOfTheOffer":
          "Lorem ipsum, ...",
        "https://vc-context.elia.be/2022/v1/Contract/jurisdiction":
          "Courts of Bruxelles",
        "https://vc-context.elia.be/2022/v1/Contract/party1": {
          "@type": "https://schema.org/Organization",
          "https://schema.org/address":
            "Boulevard de l'Empereur, 1000 Bruxelles",
          "https://schema.org/brand": "Car Manufacturer Inc",
          "https://schema.org/iso6523Code": "123456789",
        },
        "https://vc-context.elia.be/2022/v1/Contract/party2": {
          "@type": "https://schema.org/Person",
          "https://schema.org/address":
            "Boulevard de l'Empereur, 1000 Bruxelles",
          "https://schema.org/familyName": "Doe",
          "https://schema.org/givenName": "John",
        },
      },
      "https://www.w3.org/2018/credentials#issuanceDate": {
        "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
        "@value": "2023-05-14T12:55:30Z",
      },
      "https://www.w3.org/2018/credentials#issuer": {
        "@id": "did:example:dso",
      },
    }
    expect(compacted).toEqual(expected)
  })

  // test("Data display conforms to JSON schema", async () => {
  //   verifyDataDisplayStructure(dataDisplay)
  // })
})