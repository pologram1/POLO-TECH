import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/** Dependency-free Java console companion to the browser simulation. */
public final class CasinoGame {
    public static final class Account {
        private long wallet = 200, bank = 800, net = 0;
        private int rounds = 0;
        private final String name;
        private final List<String> history = new ArrayList<>();
        public Account(String name) {
            if (name == null || name.isBlank()) throw new IllegalArgumentException("Enter a player name.");
            this.name = name.trim();
        }
        public long wallet() { return wallet; }
        public long bank() { return bank; }
        public long net() { return net; }
        public int rounds() { return rounds; }
        public List<String> history() { return List.copyOf(history); }
        private void validate(long amount) {
            if (amount < 1 || amount > 1_000_000) throw new IllegalArgumentException("Amount must be between 1 and 1,000,000 credits.");
        }
        public void deposit(long amount) {
            validate(amount);
            if (amount > wallet) throw new IllegalArgumentException("Insufficient playing balance.");
            long next = Math.addExact(bank, amount);
            wallet -= amount; bank = next; history.add("Bank deposit: " + amount);
        }
        public void withdraw(long amount) {
            validate(amount);
            if (amount > bank) throw new IllegalArgumentException("Insufficient bank balance.");
            long next = Math.addExact(wallet, amount);
            bank -= amount; wallet = next; history.add("Bank withdrawal: " + amount);
        }
        public void settle(String game, long bet, int multiplier) {
            validate(bet);
            if (bet > 100 || bet > wallet) throw new IllegalArgumentException("Bet must be 1-100 credits and within your playing balance.");
            if (multiplier != 0 && multiplier != 1 && multiplier != 2 && multiplier != 8) throw new IllegalArgumentException("Invalid payout.");
            long change = bet * (multiplier - 1);
            long next = Math.addExact(wallet, change);
            long nextNet = Math.addExact(net, change);
            wallet = next; net = nextNet; rounds++;
            history.add(game + ": bet " + bet + ", returned " + bet * multiplier + ", net " + change);
        }
        @Override public String toString() { return name + " | Play: " + wallet + " CR | Bank: " + bank + " CR | Net: " + net + " CR | Rounds: " + rounds; }
    }
    public static int slotMultiplier(int a, int b, int c) {
        for (int value : new int[]{a, b, c}) if (value < 0 || value >= 5) throw new IllegalArgumentException("Invalid reel.");
        return a == b && b == c ? 8 : a == b || a == c || b == c ? 1 : 0;
    }
    public static int diceMultiplier(int roll, String choice) {
        if (roll < 1 || roll > 6 || !(choice.equals("low") || choice.equals("high"))) throw new IllegalArgumentException("Choose low or high; die must be 1-6.");
        return (choice.equals("low") ? roll <= 3 : roll >= 4) ? 2 : 0;
    }
    public static void main(String[] args) {
        SecureRandom random = new SecureRandom();
        try (Scanner input = new Scanner(System.in)) {
            System.out.println("POLO CASINO - Virtual credits only. No money or prizes.");
            System.out.print("Player name: ");
            String name = input.hasNextLine() ? input.nextLine() : "Guest";
            Account account = new Account(name.isBlank() ? "Guest" : name);
            String[] symbols = {"Diamond", "Club", "Seven", "Spade", "Heart"};
            while (true) {
                System.out.println("\n" + account);
                System.out.println("Commands: slots BET | dice BET low/high | deposit AMOUNT | withdraw AMOUNT | history | quit");
                if (!input.hasNextLine()) break;
                String[] command = input.nextLine().trim().split("\\s+");
                try {
                    if (command[0].equals("quit")) break;
                    if (command[0].equals("history")) { account.history().forEach(System.out::println); continue; }
                    if (command.length < 2) throw new IllegalArgumentException("Include an amount.");
                    long amount = Long.parseLong(command[1]);
                    switch (command[0]) {
                        case "deposit" -> account.deposit(amount);
                        case "withdraw" -> account.withdraw(amount);
                        case "slots" -> {
                            int a = random.nextInt(5), b = random.nextInt(5), c = random.nextInt(5);
                            account.settle("Slots", amount, slotMultiplier(a, b, c));
                            System.out.println(symbols[a] + " / " + symbols[b] + " / " + symbols[c]);
                        }
                        case "dice" -> {
                            if (command.length != 3) throw new IllegalArgumentException("Use: dice BET low/high");
                            int roll = random.nextInt(6) + 1;
                            account.settle("Dice", amount, diceMultiplier(roll, command[2]));
                            System.out.println("Rolled " + roll);
                        }
                        default -> throw new IllegalArgumentException("Unknown command.");
                    }
                } catch (IllegalArgumentException | ArithmeticException error) { System.out.println("Please try again: " + error.getMessage()); }
            }
        }
    }
}
