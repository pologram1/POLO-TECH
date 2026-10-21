public final class CasinoGameTest {
    private static void require(boolean condition) { if (!condition) throw new AssertionError("Check failed"); }
    private static void rejected(Runnable action) { try { action.run(); } catch (IllegalArgumentException expected) { return; } throw new AssertionError("Invalid input accepted"); }
    public static void main(String[] args) {
        CasinoGame.Account account = new CasinoGame.Account("Miguel");
        account.deposit(100); require(account.wallet() == 100 && account.bank() == 900);
        account.withdraw(200); require(account.wallet() == 300 && account.bank() == 700);
        rejected(() -> account.withdraw(701)); rejected(() -> account.deposit(-1));
        account.settle("Dice", 10, CasinoGame.diceMultiplier(6, "high"));
        require(account.wallet() == 310 && account.net() == 10);
        account.settle("Slots", 10, CasinoGame.slotMultiplier(2, 2, 2));
        require(account.wallet() == 380 && account.net() == 80 && account.rounds() == 2);
        rejected(() -> account.settle("Slots", 101, 8)); rejected(() -> CasinoGame.diceMultiplier(0, "low"));
        require(account.wallet() + account.bank() == 1000 + account.net());
        int triples = 0, pairs = 0;
        for (int a = 0; a < 5; a++) for (int b = 0; b < 5; b++) for (int c = 0; c < 5; c++) {
            int payout = CasinoGame.slotMultiplier(a, b, c);
            if (payout == 8) triples++;
            if (payout == 1) pairs++;
        }
        require(triples == 5 && pairs == 60);
        System.out.println("All Java casino checks passed.");
    }
}
