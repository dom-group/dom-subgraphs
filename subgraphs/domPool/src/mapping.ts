import { BigInt } from "@graphprotocol/graph-ts"
import {
  DomInvitation,
  Burn,
  OwnershipTransferred,
  Promote,
  Redeem,
  Register
} from "../generated/DomInvitation/DomInvitation"
import { Referer, User } from "../generated/schema"

export function handleBurn(event: Burn): void {
  let uid = event.params._userAddr.toHex();
  let _amount = event.params._amount;
  let user = User.load(uid);
  if(user!=null){
    user.burn = user.burn.plus(_amount);
    user.save();
  }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePromote(event: Promote): void {
  let uid = event.params._userAddr.toHex();
  let user = User.load(uid);
  if(user!=null){
    user.level = event.params.level;
    user.save();
  }
}

export function handleRedeem(event: Redeem): void {}

export function handleRegister(event: Register): void {
  let uid = event.params._userAddr.toHex();
  let rid = event.params._referrer.toHex();
  let user = User.load(uid);
  let _referer = Referer.load(rid);
  let timestamp = event.block.timestamp
  if(_referer==null){
    _referer = new Referer(rid);
  }
  _referer.save();
  
  let contract = DomInvitation.bind(event.address)
  let ucount = contract.Users(event.params._userAddr).value0;

  if(user==null) {
    user = new User(uid);
    user.count = ucount;
    user.level = BigInt.fromI32(0);
    user.burn = BigInt.fromI32(0);
    user.referer = _referer.id;
    user.registTime = timestamp;
    user.save();

    let _curReferer = new Referer(uid);
    _curReferer.save();
  }
}
