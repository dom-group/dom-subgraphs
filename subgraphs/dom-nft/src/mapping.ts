import { BigInt } from "@graphprotocol/graph-ts"
import {
  Mint,
  Transfer
} from "../generated/Domino/Domino"
import { DominoInfo } from "../generated/schema"

export function handleMint(event: Mint): void {
  let id = event.params.tokenId.toString();
  let domino = new DominoInfo(id);
  domino.minter = event.params.minter;
  domino.holder = event.params.holder;
  domino.tokenURI = event.params._tokenURI;
  domino.tag = event.params._tag;
  domino.cover = event.params._cover;
  domino.mintTime = event.block.timestamp;
  domino.hash = event.transaction.hash;
  domino.save();
}

export function handleTransfer(event: Transfer): void {
  let id = event.params.tokenId.toString();
  let domino = DominoInfo.load(id);
  if(domino!=null) {
    domino.holder = event.params.to;
    domino.save();
  }
}
