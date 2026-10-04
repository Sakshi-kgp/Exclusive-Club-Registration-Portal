package org.example.exclusiveclubregistrationportal.Config;



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "mailTaskExecutor")
    public Executor mailTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2); // Minimum concurrent threads keeping alive
        executor.setMaxPoolSize(5);  // Maximum concurrent threads
        executor.setQueueCapacity(50); // Queue up to 50 emails before rejecting
        executor.setThreadNamePrefix("MailAsync-");
        executor.initialize();
        return executor;
    }
}