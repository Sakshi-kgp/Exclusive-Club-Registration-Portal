package org.example.exclusiveclubregistrationportal.Service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async("mailTaskExecutor")
    public void sendWelcomeEmail(String toEmail, String memberName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to the Exclusive Club");
            message.setText("Hello " + memberName + ",\n\n" +
                    "Your registration was successful. Welcome to the portal.\n\n" +
                    "Best regards,\nSystem Administrator");

            mailSender.send(message);

            // Log the success (simulating a logger)
            System.out.println("Async thread executed: Email sent successfully to " + toEmail);

        } catch (Exception e) {
            // In a production system, you would log this error or send it to a dead-letter queue
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }
}