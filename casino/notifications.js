export function winNotice(result) {
  if (!result || result.change <= 0 || result.status === 'playing') return null;
  const dollars = value => '$' + value.toLocaleString('en-US');
  return {title: 'Won ' + dollars(result.change) + '!',
    copy: dollars(result.returned) + ' returned · includes your ' + dollars(result.bet) + ' bet.'};
}

export function emptyNotice(account) {
  if (account.wallet !== 0 || account.blackjack?.status === 'playing') return null;
  return account.bank > 0
    ? {title: 'Playing balance is empty', copy: 'You still have $' + account.bank.toLocaleString('en-US') + ' in your virtual bank.', action: 'Move dollars to play', target: 'recover-bank'}
    : {title: 'Out of virtual dollars', copy: 'Reset for a fresh session with $1,000 in free virtual dollars.', action: 'Reset session', target: 'reset-empty'};
}
