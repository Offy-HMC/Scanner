import { TransactionData } from "@/schemas/transaction";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name: string, size: number) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: size,
      height: size,
      fontSize: size / 2,
    },
    children:
      name.split(" ").length >= 2
        ? `${name.split(" ")[0][0].toUpperCase()}${name
            .split(" ")[1][0]
            .toUpperCase()}`
        : name[0].toUpperCase(),
  };
}

export function TransactionFields(text: string): TransactionData {
  const lines = text.split("\n");

  // Extract game from the first line
  const game_name = lines[0].trim();

  // Extract character number
  const characterLine = lines.find((line) => line.includes("เลขตัวละคร"));
  const character_number = characterLine
    ? characterLine.split(":")[1].trim()
    : "";
  const characterNameLine = lines.find((line) => line.includes("Name"));
  const character_name = characterNameLine
    ? characterNameLine.split(":")[1].trim()
    : "";
  const serverLine = lines.find((line) => line.includes("Server"));
  const server = serverLine ? serverLine.split(":")[1].trim() : "";
  const transactionAmountLine = lines.find((line) => line.includes("ยอดโอน"));
  const transfer_amount = transactionAmountLine
    ? parseFloat(transactionAmountLine.split(":")[1].trim())
    : 0;
  const packageLine = lines.find((line) => line.includes("แพคเกจ"));
  const packageParts = packageLine
    ? packageLine.split(":")[1].trim().split(" ")
    : "";
  const package_price = packageParts ? parseInt(packageParts[0], 10) : 0;
  const package_amount = packageParts
    ? parseInt(packageParts[1].replace("แพค", ""), 10)
    : 0;

  return {
    game_name,
    character_number,
    character_name,
    server,
    transfer_amount,
    package_price,
    package_amount,
  };
}
