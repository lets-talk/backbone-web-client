<?php

return array(

    // Login path
    
    'login_action' => 'Authentication:login',
    
    // Firewall rules
    
    'rules' => array(
    
        // Installation
        
        'Install:index'     => array('ADMIN'),
        'Install:uninstall' => array('ADMIN'),
        
        // Configuration
        
        'Config:updateSettings' => array('ADMIN'),
        'Config:resetSettings'  => array('ADMIN'),
        
        // Guest
        
        'Guest:get'       => array('OPERATOR', 'ADMIN'),
        'Guest:getAll'    => array('OPERATOR', 'ADMIN'),
        'Guest:getOnline' => array('OPERATOR', 'ADMIN'),
        
        // Operator
        
        'Operator:stayAlive'          => array('OPERATOR', 'ADMIN'),
        'Operator:updateTypingStatus' => array('OPERATOR', 'ADMIN'),
        'Operator:getTypingStatus'    => array('OPERATOR', 'ADMIN'),
        'Operator:update'             => array('OPERATOR', 'ADMIN'),
        'Operator:uploadAvatar'       => array('OPERATOR', 'ADMIN'),
        'Operator:list'               => array('OPERATOR', 'ADMIN'),
        'Operator:getOnlineUsers'     => array('OPERATOR', 'ADMIN'),
        'Operator:create'             => array('ADMIN'),
        'Operator:delete'             => array('ADMIN'),
        
        // Message
        
        'Message:send'                 => array('OPERATOR', 'ADMIN'),
        'Message:getUserHistory'       => array('OPERATOR', 'ADMIN'),
        'Message:queryHistory'         => array('OPERATOR', 'ADMIN'),
        'Message:clearHistory'         => array('ADMIN'),
        'Message:operatorGetNew'       => array('OPERATOR', 'ADMIN'),
        'Message:operatorGuestGetLast' => array('OPERATOR', 'ADMIN'),
        
        // Canned message
        
        'CannedMessage:create' => array('ADMIN'),
        'CannedMessage:get'    => array('OPERATOR', 'ADMIN'),
        'CannedMessage:list'   => array('OPERATOR', 'ADMIN'),
        'CannedMessage:update' => array('ADMIN'),
        'CannedMessage:delete' => array('ADMIN'),
        
        // Admin
        
        'Admin:index'     => array('OPERATOR', 'ADMIN'),
        'Admin:indexMin'  => array('OPERATOR', 'ADMIN'),
        'Admin:indexDev'  => array('OPERATOR', 'ADMIN'),
        'Admin:templates' => array('OPERATOR', 'ADMIN')
    )
);

?>
